// Alert Service
// Purpose: Detect threshold violations and generate smart alerts
//
// Alert Types:
// - critical: Immediate action needed (soil < 35%, temp > 90°F)
// - warning: Attention needed (approaching thresholds)
// - info: Informational updates

import { supabase } from "../config/database";

const TOMATO_THRESHOLDS = {
  temperature: { min: 65, max: 85, critical_min: 60, critical_max: 90 },
  humidity: { min: 60, max: 80, critical_min: 50, critical_max: 85 },
  soil_moisture: { min: 40, max: 60, critical_min: 35, critical_max: 70 },
  light_level: { min: 400, max: 800, critical_min: 200, critical_max: 1000 },
  co2: { min: 400, max: 1000, critical_min: 350, critical_max: 1500 },
};

const TYPE = {
  critical: "critical",
  warning: "warning",
  normal: "normal",
};

const MESSAGE = {
  critical: "Immediate action needed",
  warning: "Attention needed",
  normal: "Normal readings",
};

const SENSOR_TYPE = {
  temp: "Temperature sensor",
  humidity: "Humidity sensor",
  soil_moisture: "Soil moisture sensor",
  light_level: "Light level sensor",
  co2: "CO2 sensor",
};

/**
 * Check sensor data against thresholds
 * @param {Object} sensorData - Current sensor readings
 * @returns {Array} Array of alert objects
 */
function checkThresholds(sensorData) {
  // TODO: Implement threshold checking logic
  // Return format: [{ type, message, sensor, timestamp, resolved }]
  temp_message = checkTemp(sensorData.temp)
  humidity_message = checkHumidity(sensorData.message)
  soil_moisture_message = checkMoisture(sensorData.soil_moisture)
  light_level_message = checkLightLevel(sensorData.light_level)
  co2_message = checkCO2(sensorData.co2)
  return [temp_message, humidity_message, soil_moisture_message, light_level_message, co2_message]
}

function checkTemp(temp) {
  const temperature_thresholds = TOMATO_THRESHOLDS.temperature;

  if (temp > temperature_thresholds.critical_max || temp < temperature_thresholds.critical_min) {
    return {
      type: TYPE.critical,
      message: MESSAGE.critical,
      sensor: SENSOR_TYPE.temp,
      timestamp: new Date(),
      resolved: false
    };
  }

  if (temp > temperature_thresholds.warning_max || temp < temperature_thresholds.warning_min) {
    return {
      type: TYPE.warning,
      message: MESSAGE.warning,
      sensor: SENSOR_TYPE.temp,
      timestamp: new Date(),
      resolved: false
    };
  }

  // Normal range
  return {
    type: TYPE.normal,
    message: MESSAGE.normal,
    sensor: SENSOR_TYPE.temp,
    timestamp: new Date(),
    resolved: true
  };
}
function checkHumidity(humidity) {
  const humidity_thresholds = TOMATO_THRESHOLDS.humidity;

  if (humidity > humidity_thresholds.critical_max || humidity < humidity_thresholds.critical_min) {
    return {
      type: TYPE.critical,
      message: MESSAGE.critical,
      sensor: SENSOR_TYPE.humidity,
      timestamp: new Date(),
      resolved: false
    };
  }

  if (humidity > humidity_thresholds.warning_max || humidity < humidity_thresholds.warning_min) {
    return {
      type: TYPE.warning,
      message: MESSAGE.warning,
      sensor: SENSOR_TYPE.humidity,
      timestamp: new Date(),
      resolved: false
    };
  }

  // Normal range
  return {
    type: TYPE.normal,
    message: MESSAGE.normal,
    sensor: SENSOR_TYPE.humidity,
    timestamp: new Date(),
    resolved: true
  };
}
function checkMoisture(soil_moisture) {
  const moisture_thresholds = TOMATO_THRESHOLDS.soil_moisture;

  if (soil_moisture > moisture_thresholds.critical_max || soil_moisture < moisture_thresholds.critical_min) {
    return {
      type: TYPE.critical,
      message: MESSAGE.critical,
      sensor: SENSOR_TYPE.soil_moisture,
      timestamp: new Date(),
      resolved: false
    };
  }

  if (soil_moisture > moisture_thresholds.warning_max || soil_moisture < moisture_thresholds.warning_min) {
    return {
      type: TYPE.warning,
      message: MESSAGE.warning,
      sensor: SENSOR_TYPE.soil_moisture,
      timestamp: new Date(),
      resolved: false
    };
  }

  // Normal range
  return {
    type: TYPE.normal,
    message: MESSAGE.normal,
    sensor: SENSOR_TYPE.soil_moisture,
    timestamp: new Date(),
    resolved: true
  };
}
function checkLightLevel(light_level) {
  const light_thresholds = TOMATO_THRESHOLDS.soil_moisture;

  if (light_level > light_thresholds.critical_max || light_level < light_thresholds.critical_min) {
    return {
      type: TYPE.critical,
      message: MESSAGE.critical,
      sensor: SENSOR_TYPE.light_level,
      timestamp: new Date(),
      resolved: false
    };
  }

  if (light_level > light_thresholds.warning_max || light_level < light_thresholds.warning_min) {
    return {
      type: TYPE.warning,
      message: MESSAGE.warning,
      sensor: SENSOR_TYPE.light_level,
      timestamp: new Date(),
      resolved: false
    };
  }

  // Normal range
  return {
    type: TYPE.normal,
    message: MESSAGE.normal,
    sensor: SENSOR_TYPE.light_level,
    timestamp: new Date(),
    resolved: true
  };
}
function checkCO2(co2) {
  const co2_thresholds = TOMATO_THRESHOLDS.soil_moisture;

  if (co2 > co2_thresholds.critical_max || co2 < co2_thresholds.critical_min) {
    return {
      type: TYPE.critical,
      message: MESSAGE.critical,
      sensor: SENSOR_TYPE.co2,
      timestamp: new Date(),
      resolved: false
    };
  }

  if (co2 > co2_thresholds.warning_max || co2 < co2_thresholds.warning_min) {
    return {
      type: TYPE.warning,
      message: MESSAGE.warning,
      sensor: SENSOR_TYPE.co2,
      timestamp: new Date(),
      resolved: false
    };
  }

  // Normal range
  return {
    type: TYPE.normal,
    message: MESSAGE.normal,
    sensor: SENSOR_TYPE.co2,
    timestamp: new Date(),
    resolved: true
  };
}


/**
 * Save alert to Supabase
 * @param {Object} alert - Alert object to persist
 */
async function saveAlert(alert) {
  supabase.from("alerts").insert(alert)
}

export default {
  checkThresholds,
  saveAlert,
};
