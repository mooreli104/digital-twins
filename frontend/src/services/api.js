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
export async function getSensorHistory(timeRange = '7d') {
  // TODO: Implement fetch with query params
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
