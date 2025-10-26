# Configuration for Sensor Simulator
#
# Tomato optimal ranges and simulation parameters

# Redis Configuration
REDIS_HOST = 'redis'
REDIS_PORT = 6379
REDIS_CHANNEL = 'greenhouse:sensors'

# Sensor Update Frequency
UPDATE_INTERVAL = 2  # seconds

# Tomato Optimal Ranges
TOMATO_RANGES = {
    'temperature': {
        'optimal_min': 65,  # °F
        'optimal_max': 85,
        'critical_min': 60,
        'critical_max': 90
    },
    'humidity': {
        'optimal_min': 60,  # %
        'optimal_max': 80,
        'critical_min': 50,
        'critical_max': 85
    },
    'soil_moisture': {
        'optimal_min': 40,  # %
        'optimal_max': 60,
        'critical_min': 35,
        'critical_max': 70
    },
    'light_level': {
        'optimal_min': 400,  # lux equivalent
        'optimal_max': 800,
        'critical_min': 200,
        'critical_max': 1000
    },
    'co2': {
        'optimal_min': 400,  # ppm
        'optimal_max': 1000,
        'critical_min': 350,
        'critical_max': 1500
    }
}

# Simulation Parameters
BASE_TEMP = 75
BASE_HUMIDITY = 70
BASE_SOIL = 50
BASE_LIGHT = 600
BASE_CO2 = 700

# Demo Mode (accelerate time)
DEMO_MODE = False
TIME_MULTIPLIER = 60  # 1 real minute = 1 simulated hour
