# Sensor Simulator - Python
# Purpose: Generate realistic tomato greenhouse sensor data
#
# Features:
# - Simulate 5 sensors: temperature, humidity, soil moisture, light level, CO2
# - Realistic patterns (day/night cycles, moisture decay)
# - Publish data to Redis every 2 seconds
#
# Dependencies: redis, faker (optional)

import redis
import json
import time
import math
import random
import config

def simulate_sensors():
    """
    Generate realistic sensor readings for a tomato greenhouse
    Returns: dict with sensor values
    """
    sensor_values = {
    "temperature": config.BASE_TEMP,
    "humidity": config.BASE_HUMIDITY,
    "soil_moisture": config.BASE_SOIL,
    "light_level": config.BASE_LIGHT,
    "co2_ppm": config.BASE_CO2
    }

    return sensor_values

def main():
    """
    Main loop: generate sensor data and publish to Redis
    """
    redis_client = redis.Redis(host = config.REDIS_HOST, port = config.REDIS_PORT)


    # Define the channel and the message
    channel_name = config.REDIS_CHANNEL
    sensor_values = simulate_sensors()
    while(1):
        num_subscribers = redis_client.publish(channel_name, json.dumps(sensor_values))
        print(f"Message '{sensor_values}' published to channel '{channel_name}'.\n", flush=True)
        print(f"Number of subscribers that received the message: {num_subscribers}\n")

        time.sleep(config.UPDATE_INTERVAL)

if __name__ == "__main__":
    main()
