// Metrics Service
// Purpose: Calculate sustainability metrics (water savings, efficiency scores)

/**
 * Calculate water savings compared to traditional watering
 * @param {Array} irrigationEvents - Array of irrigation timestamps
 * @returns {Object} Water savings data
 */
function calculateWaterSavings(irrigationEvents) {
  // Traditional: 5 gallons/day on fixed schedule
  // Smart: 0.5 gallons per irrigation event

  // TODO: Implement calculation
  // Return: { savedToday, savedThisWeek, traditionalUse, smartUse }
}

/**
 * Calculate optimal range adherence score
 * @param {Object} sensorData - Current sensor readings
 * @returns {Number} Score 0-100
 */
function calculateOptimalScore(sensorData) {
  // TODO: Calculate percentage of sensors in optimal range
  // Weighted: soil_moisture (40%), temp (20%), humidity (20%), light (20%)
}

/**
 * Batch save sensor data to Supabase (every 5 minutes)
 * @param {Object} sensorData - Sensor readings to persist
 */
async function saveSensorHistory(sensorData) {
  // TODO: Insert into sensor_history table
}

module.exports = {
  calculateWaterSavings,
  calculateOptimalScore,
  saveSensorHistory,
};
