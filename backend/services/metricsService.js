// Metrics Service
// Purpose: Calculate sustainability metrics (water savings, efficiency scores)

import { supabase } from "../config/database";


const DATA_WEIGHTS = {
  soil_moisture: .4,
  humidity: .2,
  temp: .2,
  light: .2,

}

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
  const temp = sensorData.temp
  const soil_moisture = sensorData.soil_moisture
  const humidity = sensorData.humidity
  const light = sensorData.light
  return (
    temp*DATA_WEIGHTS.temp+
    soil_moisture*DATA_WEIGHTS.soil_moisture+
    humidity*DATA_WEIGHTS.humidity+
    light*DATA_WEIGHTS.light
  )
}

/**
 * Batch save sensor data to Supabase (every 5 minutes)
 * @param {Object} sensorData - Sensor readings to persist
 */
async function saveSensorHistory(sensorData) {
  // TODO: Insert into sensor_history table
  setTimeout(3000)
  supabase.from("sensor_history").insert(sensorData)
}

export default {
  calculateWaterSavings,
  calculateOptimalScore,
  saveSensorHistory,
};
