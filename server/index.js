// Minimal backend server: Express + WS broadcaster
const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws');
const axios = require('axios');

const PORT = process.env.PORT || 5055;
const RAILRADAR_KEY = process.env.VITE_RAILRADAR_API || process.env.RAILRADAR_API;
const SIMULATE = String(process.env.VITE_SIMULATE_TRAINS || process.env.SIMULATE_TRAINS || 'true').toLowerCase() === 'true';

// Howrah ~200km bbox
const BBOX = { minLat: 20.78, minLon: 86.41, maxLat: 24.38, maxLon: 90.29 };

// Proposed busiest station ring (expand easily): Howrah (HWH), Sealdah (SDAH), Shalimar (SHM), Santragachi (SRC), Kharagpur (KGP), Bandel (BDC), Barddhaman (BWN), Naihati (NH), Dankuni (DKAE), Howrah outer stations
const BUSY_STATIONS = ['HWH', 'SDAH', 'SHM', 'SRC', 'KGP', 'BDC', 'BWN', 'NH', 'DKAE'];

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws/trains/howrah' });

let cache = { trains: [], updatedAt: 0 };
let backoffUntil = 0;

function inBox(lat, lon) {
  return lat >= BBOX.minLat && lat <= BBOX.maxLat && lon >= BBOX.minLon && lon <= BBOX.maxLon;
}

async function fetchRailRadarTrains() {
  if (!RAILRADAR_KEY) return [];
  if (Date.now() < backoffUntil) return cache.trains;
  try {
    // Example RailRadar endpoint (assumed). Replace with actual when documented.
    // We'll attempt a generic endpoint; adjust path/params with their docs.
    const res = await axios.get('https://railjournal.in/api/railradar/trains', {
      headers: { Authorization: `Bearer ${RAILRADAR_KEY}` },
      params: {
        minLat: BBOX.minLat,
        minLon: BBOX.minLon,
        maxLat: BBOX.maxLat,
        maxLon: BBOX.maxLon,
        stations: BUSY_STATIONS.join(',')
      },
      timeout: 15000
    });
    const list = res.data?.trains || res.data || [];
    const normalized = list
      .map((t) => {
        const lat = Number(t.lat ?? t.latitude);
        const lon = Number(t.lon ?? t.lng ?? t.longitude);
        return {
          id: t.id || t.train_no || t.trainNumber || t.number,
          number: t.train_no || t.trainNumber || t.number,
          name: t.name || t.train_name,
          lat,
          lon,
          speed: Number(t.speed) || 0,
          lastStop: t.lastStop || t.last_station,
          nextStop: t.nextStop || t.next_station,
          dest: t.destination || t.dest,
          category: t.category || t.type || 'passenger',
          updatedAt: Date.now()
        };
      })
      .filter((t) => t.id && Number.isFinite(t.lat) && Number.isFinite(t.lon) && inBox(t.lat, t.lon));
    cache.trains = normalized;
    cache.updatedAt = Date.now();
    return normalized;
  } catch (e) {
    if (e?.response?.status === 429) {
      backoffUntil = Date.now() + 120000;
    }
    return cache.trains;
  }
}

// ---------------- Simulation ----------------
// Key stations for behavior (approximate coords)
const STATIONS = {
  HWH: { lat: 22.583, lon: 88.342 }, // Howrah
  SDAH: { lat: 22.576, lon: 88.363 },
  SHM: { lat: 22.543, lon: 88.319 },
  SRC: { lat: 22.492, lon: 88.314 },
  BWN: { lat: 23.232, lon: 87.861 },
  BDC: { lat: 22.664, lon: 88.171 },
  NH: { lat: 22.894, lon: 88.427 },
  DKAE: { lat: 22.680, lon: 88.300 },
  KGP: { lat: 22.339, lon: 87.325 }
};

// Seed routes as waypoints (LineStrings)
const ROUTES = [
  // Howrah -> Kharagpur mainline (Express)
  [{ ...STATIONS.HWH, code: 'HWH', name: 'Howrah' }, { lat: 22.47, lon: 88.05 }, { lat: 22.42, lon: 87.70 }, { ...STATIONS.KGP, code: 'KGP', name: 'Kharagpur' }],
  // Howrah -> Barddhaman (Local)
  [{ ...STATIONS.HWH, code: 'HWH', name: 'Howrah' }, { ...STATIONS.BDC, code: 'BDC', name: 'Bandel' }, { lat: 22.88, lon: 88.29 }, { ...STATIONS.BWN, code: 'BWN', name: 'Barddhaman' }],
  // Sealdah -> Naihati suburban (EMU)
  [{ ...STATIONS.SDAH, code: 'SDAH', name: 'Sealdah' }, { lat: 22.69, lon: 88.39 }, { ...STATIONS.NH, code: 'NH', name: 'Naihati' }],
  // Freight ring around Dankuni
  [{ lat: 22.64, lon: 88.30 }, { ...STATIONS.DKAE, code: 'DKAE', name: 'Dankuni' }, { lat: 22.73, lon: 88.24 }, { lat: 22.64, lon: 88.30 }],
  // Shalimar -> Santragachi short (yard/service)
  [{ ...STATIONS.SHM, code: 'SHM', name: 'Shalimar' }, { ...STATIONS.SRC, code: 'SRC', name: 'Santragachi' }]
];

const CATEGORIES = [
  { name: 'passenger', label: 'Passenger' },
  { name: 'express', label: 'Express' },
  { name: 'vande', label: 'Vande Bharat' },
  { name: 'freight', label: 'Freight' }
];

function randomInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function lerp(a, b, t) { return a + (b - a) * t; }
function distKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180;
  const la2 = b.lat * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
}

function generateTrainNumber(prefix) {
  const base = randomInt(11000, 22999);
  return String(base) + (prefix === 'freight' ? 'F' : '');
}

function getStationName(station) {
  const stationNames = {
    'HWH': 'Howrah',
    'SDAH': 'Sealdah', 
    'SHM': 'Shalimar',
    'SRC': 'Santragachi',
    'BWN': 'Barddhaman',
    'BDC': 'Bandel',
    'NH': 'Naihati',
    'DKAE': 'Dankuni',
    'KGP': 'Kharagpur'
  };
  return stationNames[station.code] || station.name || 'Unknown Station';
}

function getStationCode(station) {
  return station.code || 'UNK';
}

// Initialize simulated trains
let simTrains = [];
function initSimulation() {
  simTrains = [];
  for (let i = 0; i < 50; i++) {
    const route = ROUTES[i % ROUTES.length];
    const cat = CATEGORIES[i % CATEGORIES.length].name;
    const name = (
      cat === 'vande' ? 'Vande Bharat Express' :
      cat === 'express' ? 'Superfast Express' :
      cat === 'freight' ? 'Goods Special' :
      'Passenger Local'
    );
    const number = generateTrainNumber(cat);
    // Start at random segment
    const seg = Math.max(0, Math.min(route.length - 2, randomInt(0, route.length - 2)));
    const t = Math.random();
    const lat = lerp(route[seg].lat, route[seg+1].lat, t);
    const lon = lerp(route[seg].lon, route[seg+1].lon, t);
    const speed = (
      cat === 'freight' ? randomInt(20, 55) :
      cat === 'vande' ? randomInt(60, 110) :
      cat === 'express' ? randomInt(45, 90) :
      randomInt(20, 60)
    );
    simTrains.push({
      id: number,
      number,
      name,
      lat,
      lon,
      speed,
      routeIdx: i % ROUTES.length,
      segIdx: seg,
      segT: t,
      category: cat,
      dwellUntil: 0,
      dest: 'HOWRAH SECTION',
      lastStop: '',
      nextStop: '',
      // Enhanced train data
      from: getStationName(route[0]),
      to: getStationName(route[route.length - 1]),
      fromCode: getStationCode(route[0]),
      toCode: getStationCode(route[route.length - 1]),
      coachCount: cat === 'freight' ? randomInt(20, 50) : randomInt(8, 22),
      platform: randomInt(1, 8),
      delay: randomInt(0, 30),
      status: 'Running',
      estimatedArrival: new Date(Date.now() + randomInt(1800000, 7200000)).toISOString(),
      updatedAt: Date.now()
    });
  }
}

function nearStation(train) {
  let min = { id: '', d: 1e9 };
  Object.entries(STATIONS).forEach(([id, s]) => {
    const d = distKm({ lat: train.lat, lon: train.lon }, s);
    if (d < min.d) min = { id, d };
  });
  return min; // {id, d in km}
}

function stepSimulation(dtSec = 1) {
  const now = Date.now();
  simTrains.forEach((tr) => {
    const route = ROUTES[tr.routeIdx];
    // Dwell logic near stations
    const prox = nearStation(tr);
    if (prox.d < 0.5) { // within 500m
      if (tr.dwellUntil < now) {
        // set dwell for 10-45s occasionally
        if (Math.random() < 0.05) tr.dwellUntil = now + randomInt(10000, 45000);
      }
    }
    const isDwelling = now < tr.dwellUntil;
    // Speed adjustments
    const base = tr.speed;
    const slow = prox.d < 1.0 ? Math.max(8, base * 0.3) : base; // slow near stations
    const vKmh = isDwelling ? 0 : slow + (Math.random() - 0.5) * 4; // slight jitter
    const vKms = Math.max(0.001, vKmh) / 3600; // km per sec (minimum 0.001 to avoid division by zero)

    // Advance along current segment
    const a = route[tr.segIdx];
    const b = route[tr.segIdx + 1] || a;
    const segLenKm = Math.max(0.01, distKm(a, b));
    const segDur = segLenKm / Math.max(0.001, vKms);
    const dtT = Math.min(1, (vKms / segLenKm) * dtSec);
    tr.segT += dtT;
    if (tr.segT >= 1) {
      tr.segIdx++;
      tr.segT = tr.segT - 1;
      if (tr.segIdx >= route.length - 1) {
        // loop route
        tr.segIdx = 0;
        tr.segT = 0;
      }
    }
    const p = route[tr.segIdx];
    const q = route[tr.segIdx + 1];
    tr.lat = lerp(p.lat, q.lat, tr.segT);
    tr.lon = lerp(p.lon, q.lon, tr.segT);
    tr.updatedAt = now;
    // Update nearest stops
    const prox2 = nearStation(tr);
    tr.nextStop = prox2.id;
    
    // Update dynamic data
    tr.speed = Math.max(0, vKmh);
    tr.status = isDwelling ? 'Stopped' : 'Running';
    if (Math.random() < 0.01) { // 1% chance to change delay
      tr.delay = Math.max(0, tr.delay + randomInt(-5, 10));
    }
  });
  cache.trains = simTrains.filter((t) => inBox(t.lat, t.lon));
  cache.updatedAt = Date.now();
}

if (SIMULATE) initSimulation();

// WS broadcast loop
setInterval(async () => {
  let trains = [];
  if (SIMULATE) {
    stepSimulation(1);
    trains = cache.trains;
  } else {
    trains = await fetchRailRadarTrains();
  }
  const payload = JSON.stringify({ type: 'trains', updatedAt: Date.now(), trains });
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  });
}, 1000);

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, updatedAt: cache.updatedAt, trains: cache.trains.length }));

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
