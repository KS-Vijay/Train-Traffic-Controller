import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
// Using backend WebSocket stream instead of direct API polling
import 'maplibre-gl/dist/maplibre-gl.css';

const InteractiveMap = ({ selectedFilters, mapLayers, zoomLevel, onTrainSelect, selectedTrain, onTrainsUpdate }) => {
  const [selectedTrainData, setSelectedTrainData] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const focusMarkerRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const style = {
      version: 8,
      sources: {
        osmBase: {
          type: 'raster',
          tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        { id: 'osmBase', type: 'raster', source: 'osmBase' },
        // ORM tiles disabled due to DNS/availability issues; keep OSM base only
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style,
      center: [88.35, 22.58],
      zoom: 11,
      dragRotate: false,
      pitchWithRotate: false
    });
    mapRef.current = map;

    map.setMaxBounds([
      [86.41, 20.78],
      [90.29, 24.38]
    ]);

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    // Optional: fetch custom-colored vector tracks. Disabled by default to avoid Overpass timeouts.
    if (import.meta.env.VITE_ENABLE_OVERPASS === 'true') {
      const bbox = { minLat: 20.78, minLon: 86.41, maxLat: 24.38, maxLon: 90.29 };
      const overpassQL = `
        [out:json][timeout:120];
        (
          way["railway"="rail"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
        );
        out tags geom;`;
      const toGeoJSON = (osmJson) => {
        const features = [];
        if (!osmJson || !osmJson.elements) return { type: 'FeatureCollection', features };
        for (const el of osmJson.elements) {
          if (el.type === 'way' && el.geometry && el.geometry.length > 1) {
            const coords = el.geometry.map((g) => [g.lon, g.lat]);
            features.push({
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: coords },
              properties: { ...(el.tags || {}), id: el.id }
            });
          }
        }
        return { type: 'FeatureCollection', features };
      };
      fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ data: overpassQL }).toString()
      })
        .then((r) => r.json())
        .then((osm) => {
          const geo = toGeoJSON(osm);
          if (!geo.features.length) return;
          if (!map.getSource('howrah-tracks')) {
            map.addSource('howrah-tracks', { type: 'geojson', data: geo });
          }
          if (!map.getLayer('tracks-main')) {
            map.addLayer({ id: 'tracks-main', type: 'line', source: 'howrah-tracks', paint: { 'line-color': '#ff4d4f', 'line-width': 2 } });
          }
        })
        .catch((e) => console.warn('Overpass disabled/failed', e?.message || e));
    }

    // Subscribe to backend WebSocket for live trains in section
    try {
      const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://localhost:5055/ws/trains/howrah`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => console.log('[WS] connected', wsUrl);
      ws.onerror = (e) => console.warn('[WS] error', e);
      ws.onclose = () => console.warn('[WS] closed');
      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload?.type !== 'trains') return;
          const list = Array.isArray(payload.trains) ? payload.trains : [];
          // eslint-disable-next-line no-console
          console.log('[WS] trains received:', list.length);
          
          // Pass trains to parent for filters and search
          if (onTrainsUpdate) {
            onTrainsUpdate(list);
          }
          const defaultPos = [88.35, 22.58];
          const TRAIN_ICON_PATH = '/assets/images/train.png';
          const nowIds = new Set();
          // Filter trains based on selected filters
          const filteredList = list.filter(train => {
            if (!selectedFilters || selectedFilters.length === 0) return true;
            
            // Check category filter
            if (selectedFilters.includes(train.category)) return true;
            
            // Check delayed filter
            if (selectedFilters.includes('delayed') && (train.delay || 0) > 0) return true;
            
            return false;
          });

          const src = filteredList.length ? filteredList : [
            { id: 'demo-1', lon: defaultPos[0] + 0.05, lat: defaultPos[1] + 0.02 },
            { id: 'demo-2', lon: defaultPos[0] - 0.03, lat: defaultPos[1] - 0.01 },
            { id: 'demo-3', lon: defaultPos[0] + 0.02, lat: defaultPos[1] - 0.03 }
          ];
          for (const t of src) {
            const id = t.id || t.number;
            if (!id) continue;
            nowIds.add(id);
            const lon = Number(t.lon) || defaultPos[0];
            const lat = Number(t.lat) || defaultPos[1];
            let marker = markersRef.current[id];
            if (!marker) {
              const el = document.createElement('img');
              el.src = TRAIN_ICON_PATH;
              el.style.width = '20px';
              el.style.height = '20px';
              el.style.transform = 'translate(-50%, -50%)';
              el.style.cursor = 'pointer';
              el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
              el.title = `${t.name || t.number} - ${t.speed || 0} km/h`;
              
              // Add click handler
              el.addEventListener('click', (e) => {
                e.stopPropagation();
                setSelectedTrainData(t);
                onTrainSelect && onTrainSelect(t);
                
                // Highlight selected train
                Object.values(markersRef.current).forEach(m => {
                  m.getElement().style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
                  m.getElement().style.border = 'none';
                });
                el.style.filter = 'drop-shadow(0 0 8px rgba(34,197,94,0.8))';
                el.style.border = '2px solid #22c55e';
                
                // Center map on train
                map.flyTo({ center: [lon, lat], zoom: 14, speed: 0.8 });
              });
              
              marker = new maplibregl.Marker({ element: el, anchor: 'center' })
                .setLngLat([lon, lat])
                .addTo(map);
              markersRef.current[id] = marker;
            } else {
              marker.setLngLat([lon, lat]);
            }
          }
          Object.keys(markersRef.current).forEach((id) => {
            if (!nowIds.has(id)) {
              markersRef.current[id].remove();
              delete markersRef.current[id];
            }
          });
        } catch (err) {
          console.warn('[WS] parse error', err);
        }
      };
    } catch (err) {
      console.warn('[WS] init failed', err);
    }

    return () => {
      try { wsRef.current && wsRef.current.close(); } catch {}
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedTrain?.number) return;
    (async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_TRAIN_API_BASE}/api/v1/liveTrainStatus?trainNo=${encodeURIComponent(selectedTrain.number)}&startDay=1`, {
          headers: {
            'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY
          }
        });
        const d = await resp.json();
        const lat = d?.data?.latitude || d?.latitude;
        const lon = d?.data?.longitude || d?.longitude;
        const hasCoord = typeof lat === 'number' && typeof lon === 'number';
        const target = hasCoord ? [lon, lat] : [88.35, 22.58];
        mapRef.current.flyTo({ center: target, zoom: hasCoord ? 14 : 12, speed: 0.8, curve: 1.4 });
        if (focusMarkerRef.current) {
          focusMarkerRef.current.remove();
          focusMarkerRef.current = null;
        }
        const el = document.createElement('div');
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.6)';
        el.style.background = 'url(/assets/images/train.png) center/contain no-repeat';
        focusMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(target)
          .addTo(mapRef.current);
      } catch {}
    })();
  }, [selectedTrain?.number]);

  useEffect(() => {
    if (!mapRef.current) return;
    try {
      const z = Math.max(8, Math.min(14, zoomLevel || 11));
      mapRef.current.setZoom(z);
    } catch {}
  }, [zoomLevel]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Track Legend */}
      <div className="absolute top-2 left-2 z-10 bg-card/95 border border-border rounded-md p-2 shadow">
        <div className="text-xs font-semibold text-foreground mb-1">Track Legend</div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-0.5" style={{ backgroundColor: '#ff4d4f' }} />
            <span>Main Line</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-0.5" style={{ backgroundColor: '#2ea1ff' }} />
            <span>Branch Line</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-0.5 border-t border-dashed" style={{ borderColor: '#9aa0a6' }} />
            <span>Yard / Service</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-0.5" style={{ backgroundColor: '#22c55e' }} />
            <span>Electrified</span>
        </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#6f42c1' }} />
            <span>Stations</span>
      </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            <span>Signals</span>
              </div>
              </div>
            </div>

    </div>
  );
};

export default InteractiveMap;