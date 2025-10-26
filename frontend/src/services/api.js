// API Service
// Purpose: HTTP client for REST API calls to backend
//
// Available endpoints:
// - GET /api/sensors/current
// - GET /api/sensors/history?timeRange=7d
// - GET /api/alerts
// - POST /api/alerts/:id/resolve
// - GET /api/metrics/water-savings

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fetch current sensor readings
export async function getCurrentSensors() {
  // TODO: Implement fetch
  // const response = await fetch(`${API_BASE_URL}/sensors/current`);
  // return response.json();
}

// Fetch historical sensor data
export async function getSensorHistory(timeRange = '7d', greenhouse_id = null, sensor_type = null) {
  const params = new URLSearchParams({ timeRange });
  if (greenhouse_id) params.append('greenhouse_id', greenhouse_id);
  if (sensor_type) params.append('sensor_type', sensor_type);

  const response = await fetch(`${API_BASE_URL}/sensors/history?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sensor history: ${response.statusText}`);
  }
  return response.json();
}

// Fetch alert history
export async function getAlerts() {
  // TODO: Implement fetch
}

// Mark alert as resolved
export async function resolveAlert(alertId) {
  // TODO: Implement POST request
}

// Get water savings metrics
export async function getWaterSavings() {
  // TODO: Implement fetch
}

export default {
  getCurrentSensors,
  getSensorHistory,
  getAlerts,
  resolveAlert,
  getWaterSavings,
};
