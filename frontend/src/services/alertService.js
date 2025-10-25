// Alert Service
// Purpose: Handle alert detection and persistence to Supabase

import { supabase } from './supabase';

/**
 * Save an alert to Supabase
 * @param {Object} alert - { type, sensor, message, greenhouse_id }
 * @returns {Object} Created alert with ID
 */
export async function saveAlert(alert) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert([{
        greenhouse_id: alert.greenhouse_id || null, // Will be set when you have greenhouses
        type: alert.type, // 'warning' or 'critical'
        sensor: alert.sensor,
        message: alert.message,
        resolved: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving alert:', error);
    throw error;
  }
}

/**
 * Get recent alerts from Supabase
 * @param {number} limit - Number of alerts to fetch
 * @returns {Array} List of alerts
 */
export async function getRecentAlerts(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

/**
 * Mark an alert as resolved
 * @param {string} alertId - UUID of the alert
 */
export async function resolveAlert(alertId) {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (error) throw error;
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
}

/**
 * Detect threshold violations and create alert objects
 * @param {Object} sensorData - Current sensor readings
 * @param {Array} sensorConfig - Sensor threshold configurations
 * @param {Object} previousAlerts - Map of recent alerts to avoid duplicates
 * @returns {Array} New alerts to be saved
 */
export function detectAlerts(sensorData, sensorConfig, previousAlerts = {}) {
  const newAlerts = [];

  sensorConfig.forEach(sensor => {
    const value = sensorData[sensor.key];
    if (value === undefined || value === null) return;

    const alertKey = sensor.key; // Use sensor key to track if we already alerted

    // Critical thresholds
    if (value < sensor.criticalMin) {
      if (!previousAlerts[`${alertKey}_critical_low`]) {
        newAlerts.push({
          type: 'critical',
          sensor: sensor.key,
          message: `${sensor.name} critically low at ${value.toFixed(1)}${sensor.unit} (min: ${sensor.criticalMin}${sensor.unit})`,
          timestamp: new Date().toISOString(),
          alertKey: `${alertKey}_critical_low`
        });
      }
    } else if (value > sensor.criticalMax) {
      if (!previousAlerts[`${alertKey}_critical_high`]) {
        newAlerts.push({
          type: 'critical',
          sensor: sensor.key,
          message: `${sensor.name} critically high at ${value.toFixed(1)}${sensor.unit} (max: ${sensor.criticalMax}${sensor.unit})`,
          timestamp: new Date().toISOString(),
          alertKey: `${alertKey}_critical_high`
        });
      }
    }
    // Warning thresholds (only if not critical)
    else if (value < sensor.optimalMin) {
      if (!previousAlerts[`${alertKey}_warning_low`]) {
        newAlerts.push({
          type: 'warning',
          sensor: sensor.key,
          message: `${sensor.name} below optimal at ${value.toFixed(1)}${sensor.unit} (optimal: ${sensor.optimalMin}-${sensor.optimalMax}${sensor.unit})`,
          timestamp: new Date().toISOString(),
          alertKey: `${alertKey}_warning_low`
        });
      }
    } else if (value > sensor.optimalMax) {
      if (!previousAlerts[`${alertKey}_warning_high`]) {
        newAlerts.push({
          type: 'warning',
          sensor: sensor.key,
          message: `${sensor.name} above optimal at ${value.toFixed(1)}${sensor.unit} (optimal: ${sensor.optimalMin}-${sensor.optimalMax}${sensor.unit})`,
          timestamp: new Date().toISOString(),
          alertKey: `${alertKey}_warning_high`
        });
      }
    }
  });

  return newAlerts;
}
