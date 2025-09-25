// Create RapidAPI IRCTC1 axios client using env vars
import axios from 'axios';

const baseURL = import.meta.env.VITE_TRAIN_API_BASE;
const rapidHost = import.meta.env.VITE_RAPIDAPI_HOST;
const rapidKey = import.meta.env.VITE_RAPIDAPI_KEY;

export const trainApi = axios.create({
  baseURL,
  headers: {
    'X-RapidAPI-Host': rapidHost,
    'X-RapidAPI-Key': rapidKey
  },
  timeout: 15000
});

// Simple client-side rate limit backoff for 429 responses
let backoffUntilTs = 0;
trainApi.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 429) {
      // Exponential-ish backoff: minimum 2 minutes
      const now = Date.now();
      backoffUntilTs = Math.max(backoffUntilTs, now + 2 * 60 * 1000);
    }
    return Promise.reject(err);
  }
);

export function isRateLimited() {
  return Date.now() < backoffUntilTs;
}

// IRCTC1 endpoints (RapidAPI)
export function liveTrainStatus({ trainNo, startDay }) {
  return trainApi.get('/api/v1/liveTrainStatus', { params: { trainNo, startDay } });
}

export function getTrainSchedule({ trainNo }) {
  return trainApi.get('/api/v1/getTrainSchedule', { params: { trainNo } });
}

export function searchTrain({ query }) {
  return trainApi.get('/api/v1/searchTrain', { params: { query } });
}

export function trainsBetweenStations({ fromStationCode, toStationCode }) {
  return trainApi.get('/api/v3/trainBetweenStations', { params: { fromStationCode, toStationCode } });
}

export function getTrainsByStation(params) {
  // provider expects additional params in body or query depending on plan
  return trainApi.get('/api/v3/getTrainsByStation', { params });
}

export async function getLiveStation({ stationCode, hours }) {
  if (isRateLimited()) {
    return { data: { data: [], error: 'rate_limited' } };
  }
  // Use canonical params; provider expects stationCode and hours
  return trainApi.get('/api/v3/getLiveStation', { params: { stationCode, hours } });
}
