# Sensor Simulator - Python
# Purpose: Generate realistic tomato greenhouse sensor data
#
# Features:
# - Simulate 5 sensors: temperature, humidity, soil moisture, light level, CO2
# - Realistic patterns (day/night cycles, moisture decay)
# - Publish data to Redis every 2 seconds
#
# Dependencies: redis, json, math, random

import redis
import json
import time
import math
import random
import config

# -----------------------------
# Configuration Parameters
# -----------------------------
CRASH_PROB = 0.01  # 1% chance of sensor spike/drop per reading

# reasonable ranges for clamping
RANGES = {
    "temperature": (50, 95),
    "humidity": (30, 95),
    "soil_moisture": (20, 80),
    "light_level": (0, 1000),
    "co2_ppm": (350, 1500)
}

# volatility — how fast each variable drifts
VOLATILITY = {
    "temperature": 0.4,
    "humidity": 0.8,
    "soil_moisture": 0.25,
    "light_level": 40,
    "co2_ppm": 10
}


def apply_variation(prev_values, elapsed_seconds):
    """Generate new sensor values based on time and random variation."""
    new_values = prev_values.copy()

    # Day-night cycle: 24-hour period scaled to ~120s loop
    day_progress = (elapsed_seconds % 120) / 120.0  # repeat every 2 minutes
    light_cycle = max(0, math.sin(day_progress * math.pi))  # 0→1→0
    new_values["light_level"] = config.BASE_LIGHT * (0.2 + 0.8 * light_cycle)

    # Temperature follows light (warmer during “day”)
    temp_drift = random.uniform(-VOLATILITY["temperature"], VOLATILITY["temperature"])
    new_values["temperature"] += temp_drift + (light_cycle - 0.5) * 0.5
    new_values["temperature"] += (config.BASE_TEMP - new_values["temperature"]) * 0.05

    # Humidity drifts inversely with temperature
    humid_drift = random.uniform(-VOLATILITY["humidity"], VOLATILITY["humidity"])
    new_values["humidity"] += humid_drift - (new_values["temperature"] - config.BASE_TEMP) * 0.2
    new_values["humidity"] += (config.BASE_HUMIDITY - new_values["humidity"]) * 0.05

    # Soil moisture slowly decreases; occasional irrigation reset
    new_values["soil_moisture"] -= 0.15 + random.uniform(-0.05, 0.05)
    if new_values["soil_moisture"] < 30:
        print("💧 Automatic irrigation triggered")
        new_values["soil_moisture"] = 55 + random.random() * 5

    # CO₂ fluctuates gently
    co2_drift = random.uniform(-VOLATILITY["co2_ppm"], VOLATILITY["co2_ppm"])
    new_values["co2_ppm"] += co2_drift
    new_values["co2_ppm"] += (config.BASE_CO2 - new_values["co2_ppm"]) * 0.02

    # Occasional crash/spike anomalies
    for key in new_values:
        if random.random() < CRASH_PROB:
            crash_type = random.choice(["low", "high"])
            factor = random.uniform(0.3, 0.6) if crash_type == "low" else random.uniform(1.4, 2.0)
            new_values[key] *= factor
            print(f"⚠️  Sensor anomaly on {key}: {'spike' if factor > 1 else 'drop'} ({new_values[key]:.1f})")

    # Clamp to realistic range
    for key, (min_val, max_val) in RANGES.items():
        new_values[key] = max(min_val, min(max_val, new_values[key]))

    return new_values


def simulate_sensors(prev_values=None, elapsed_seconds=0):
    """Return new simulated readings."""
    if prev_values is None:
        prev_values = {
            "temperature": config.BASE_TEMP,
            "humidity": config.BASE_HUMIDITY,
            "soil_moisture": config.BASE_SOIL,
            "light_level": config.BASE_LIGHT,
            "co2_ppm": config.BASE_CO2,
        }
    return apply_variation(prev_values, elapsed_seconds)


def main():
    redis_client = redis.Redis(host=config.REDIS_HOST, port=config.REDIS_PORT)
    channel_name = config.REDIS_CHANNEL
    sensor_values = simulate_sensors()
    start_time = time.time()

    print(f"✅ Starting sensor simulation. Publishing to channel '{channel_name}' ...\n")

    while True:
        elapsed = time.time() - start_time
        sensor_values = simulate_sensors(sensor_values, elapsed)

        redis_client.publish(channel_name, json.dumps(sensor_values))
        print(f"📡 Published: {sensor_values}", flush=True)

        time.sleep(config.UPDATE_INTERVAL)


if __name__ == "__main__":
    main()
