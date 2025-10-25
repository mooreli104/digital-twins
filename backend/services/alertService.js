// Alert Service
// Purpose: Detect threshold violations and generate smart alerts
//
// Alert Types:
// - critical: Immediate action needed (soil < 35%, temp > 90°F)
// - warning: Attention needed (approaching thresholds)
// - info: Informational updates

const TOMATO_THRESHOLDS = {
  temperature: { min: 65, max: 85, critical_min: 60, critical_max: 90 },
  humidity: { min: 60, max: 80, critical_min: 50, critical_max: 85 },
  soil_moisture: { min: 40, max: 60, critical_min: 35, critical_max: 70 },
  light_level: { min: 400, max: 800, critical_min: 200, critical_max: 1000 },
  co2: { min: 400, max: 1000, critical_min: 350, critical_max: 1500 },
};

/**
 * Check sensor data against thresholds
 * @param {Object} sensorData - Current sensor readings
 * @returns {Array} Array of alert objects
 */
function checkThresholds(sensorData) {
  // TODO: Implement threshold checking logic
  // Return format: [{ type, message, sensor, timestamp, resolved }]
}

/**
 * Save alert to Supabase
 * @param {Object} alert - Alert object to persist
 */
async function saveAlert(alert) {
  // TODO: Insert into Supabase alerts table
}

module.exports = {
  checkThresholds,
  saveAlert,
};
