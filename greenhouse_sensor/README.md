# ESP32 Greenhouse Sensor Setup Guide

This guide will help you set up the ESP32 with DHT11 temperature/humidity sensor and soil moisture sensor to send real-time data to your FarmTwin backend.

## Hardware Requirements

- **ESP32 Development Board** (ESP32-DevKitC or similar)
- **DHT11 Temperature & Humidity Sensor** (or DHT22 for better accuracy)
- **Capacitive Soil Moisture Sensor v1.2** (or resistive soil moisture sensor)
- **Breadboard** (optional, for prototyping)
- **Jumper Wires** (male-to-male, male-to-female)
- **USB Cable** (for programming ESP32)

## Wiring Diagram

### DHT11 Sensor Connections

```
DHT11          ESP32
-----          -----
VCC    ---->   3.3V
GND    ---->   GND
DATA   ---->   GPIO 4
```

**Note**: Some DHT11 modules have a built-in pull-up resistor. If yours doesn't, add a 10kΩ resistor between VCC and DATA.

### Soil Moisture Sensor Connections

```
Moisture Sensor     ESP32
---------------     -----
VCC         ---->   3.3V (or 5V if sensor supports it)
GND         ---->   GND
AOUT        ---->   GPIO 34 (ADC1_CH6)
```

**Important**: ESP32 ADC pins work best with 0-3.3V. If your sensor outputs 0-5V, use a voltage divider or a 3.3V sensor.

### Complete Wiring Diagram

```
                    ESP32 DevKit
                   ┌──────────┐
                   │          │
DHT11 VCC ────────>│ 3.3V     │
DHT11 GND ────────>│ GND      │
DHT11 DATA ───────>│ GPIO 4   │
                   │          │
Soil VCC ─────────>│ 3.3V     │
Soil GND ─────────>│ GND      │
Soil AOUT ────────>│ GPIO 34  │
                   │          │
USB Cable ────────>│ USB Port │
                   └──────────┘
```

## ESP32 Pin Reference

### GPIO 4 (DHT11 Data)
- Digital input pin
- Safe for 3.3V sensors
- No special configuration needed

### GPIO 34 (Soil Moisture Analog)
- ADC1_CH6 (Analog-to-Digital Converter)
- 12-bit resolution (0-4095)
- Input only (cannot be used as output)
- Used for reading analog voltage from soil sensor

## Software Setup

### 1. Install PlatformIO

If you haven't already:
- Install Visual Studio Code
- Install the PlatformIO extension
- Restart VS Code

### 2. Configure WiFi and API Endpoint

Open `src/main.cpp` and update these lines (28-35):

```cpp
// WiFi credentials - CHANGE THESE TO YOUR NETWORK
const char* WIFI_SSID = "YOUR_WIFI_SSID";          // Your WiFi name
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";  // Your WiFi password

// Backend API endpoint - CHANGE THIS TO YOUR COMPUTER'S IP
const char* API_ENDPOINT = "http://192.168.1.100:3001/api/sensors/data";
```

#### How to Find Your Computer's IP Address:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your WiFi/Ethernet adapter
```

**macOS/Linux:**
```bash
ifconfig
# Look for "inet" address under en0 (WiFi) or eth0 (Ethernet)
```

**Example:**
If your IP is `192.168.1.150`, set:
```cpp
const char* API_ENDPOINT = "http://192.168.1.150:3001/api/sensors/data";
```

### 3. Upload Code to ESP32

1. Connect ESP32 to your computer via USB
2. Open this project in PlatformIO
3. Click the **Upload** button (→) in the bottom toolbar
4. Wait for compilation and upload to complete

### 4. Monitor Serial Output

1. Click the **Serial Monitor** button (plug icon) in PlatformIO
2. Set baud rate to **115200**
3. You should see output like:

```
========================================
ESP32 Greenhouse Sensor System
========================================

Initializing DHT11 sensor...
DHT11 initialized!
Soil moisture sensor initialized!
Connecting to WiFi...
SSID: MyWiFi
..........
✓ WiFi Connected!
IP Address: 192.168.1.200
API Endpoint: http://192.168.1.150:3001/api/sensors/data

Setup complete! Starting sensor readings...

----------------------------------------
Reading #1
----------------------------------------

📊 Sensor Readings:
  🌡️  Temperature:   72.5°F
  💧 Humidity:      65.3%
  🌱 Soil Moisture: 45.2%
  💡 Light Level:   600.0 lux (simulated)
  🌫️  CO2 Level:     700.0 ppm (simulated)

Sending data to backend...
JSON Payload: {"temperature":72.5,"humidity":65.3,"soil_moisture":45.2,"light_level":600.0,"co2_ppm":700.0}
✓ HTTP Response Code: 200
Response: {"success":true,"message":"Sensor data received successfully"}
```

## Backend Setup

### 1. Ensure Backend is Running

Make sure your Node.js backend server is running:

```bash
cd backend
npm install
npm start
```

The server should be running on `http://localhost:3001`

### 2. Test API Endpoint

Test that the endpoint is accessible from ESP32:

```bash
# On your computer, test the endpoint
curl -X POST http://localhost:3001/api/sensors/data \
  -H "Content-Type: application/json" \
  -d '{"temperature":75,"humidity":70,"soil_moisture":50,"light_level":600,"co2_ppm":700}'
```

Expected response:
```json
{
  "success": true,
  "message": "Sensor data received successfully",
  "data": {
    "temperature": 75,
    "humidity": 70,
    "soil_moisture": 50,
    "light_level": 600,
    "co2_ppm": 700,
    "timestamp": "2025-10-25T22:30:00.000Z"
  }
}
```

## Sensor Calibration

### Soil Moisture Sensor Calibration

The soil moisture sensor needs calibration for accurate readings. Update values in `main.cpp` (lines 182-183):

```cpp
const int DRY_VALUE = 3000;   // Sensor value in completely dry soil
const int WET_VALUE = 1500;   // Sensor value in saturated soil
```

#### Calibration Steps:

1. **Measure Dry Value:**
   - Leave sensor in open air (completely dry)
   - Check Serial Monitor for raw ADC value
   - Set this as `DRY_VALUE`

2. **Measure Wet Value:**
   - Submerge sensor in water or very wet soil
   - Check Serial Monitor for raw ADC value
   - Set this as `WET_VALUE`

3. **Upload Updated Code:**
   - Re-upload the code with new calibration values

### DHT11 Accuracy

DHT11 has these specifications:
- **Temperature**: ±2°C accuracy
- **Humidity**: ±5% accuracy
- **Update Rate**: 1 reading per 2 seconds (max)

For better accuracy, consider upgrading to **DHT22**:
- Temperature: ±0.5°C
- Humidity: ±2%

To use DHT22, simply change line 43:
```cpp
#define DHT_TYPE DHT22  // Change from DHT11 to DHT22
```

## Troubleshooting

### WiFi Connection Issues

**Problem**: ESP32 can't connect to WiFi
- Verify SSID and password are correct
- Ensure ESP32 and computer are on the same network
- Check WiFi signal strength (ESP32 needs 2.4GHz WiFi, not 5GHz)

### HTTP Request Failures

**Problem**: Error code -1 or connection refused
- Verify backend server is running (`npm start` in backend folder)
- Check your computer's IP address hasn't changed
- Ensure firewall allows port 3001
- Test endpoint with curl from another computer on network

### Sensor Reading Errors

**Problem**: "Failed to read from DHT11"
- Check wiring connections
- Ensure DHT11 VCC is connected to 3.3V
- Add 10kΩ pull-up resistor if needed
- Wait 2 seconds after DHT initialization

**Problem**: Soil moisture always reads 0% or 100%
- Check sensor wiring
- Calibrate sensor (see Calibration section)
- Verify GPIO 34 is an ADC-capable pin
- Check sensor power supply (3.3V or 5V as needed)

### Serial Monitor Shows Garbage Characters

- Check baud rate is set to **115200**
- Press the RESET button on ESP32
- Try a different USB cable or port

## Data Flow Architecture

```
┌─────────────┐
│   ESP32     │  Reads sensors every 2 seconds
│  + DHT11    │
│  + Moisture │
└──────┬──────┘
       │ WiFi HTTP POST
       │ JSON: {"temperature": 72.5, "humidity": 65, ...}
       ↓
┌──────────────────────┐
│  Backend API Server  │  http://YOUR_IP:3001/api/sensors/data
│  (Node.js/Express)   │  - Validates data
│                      │  - Stores in memory
└──────┬───────────────┘  - Responds with success
       │
       ├──> WebSocket Broadcast (Future: Socket.io)
       │    └──> Frontend (Real-time display)
       │
       └──> Supabase Database (Future: Batch save)
```

## Using Simulated and Real Data Together

The system is designed to work with **both** simulator and real ESP32 data:

### Simulator (Python) - Runs on Computer
```bash
cd simulator
python sensor_simulator.py
```
- Sends data to Redis pub/sub channel
- Can generate day/night cycles (when implemented)
- Useful for testing without hardware

### ESP32 (Hardware) - Real Sensors
- Sends data directly to HTTP API
- Provides real temperature, humidity, soil moisture
- Uses simulated values for light and CO2 (until you add those sensors)

### Hybrid Approach
You can run **both** simultaneously:
- Use ESP32 for temperature, humidity, soil moisture (real data)
- Use simulator for light level and CO2 (simulated patterns)
- Backend can merge both data sources

## Next Steps

1. **WebSocket Integration**: Broadcast ESP32 data to frontend in real-time
2. **Alert System**: Integrate with threshold checking (already defined in backend)
3. **Database Storage**: Batch save readings to Supabase every 5 minutes
4. **Additional Sensors**:
   - Add light sensor (BH1750 or photoresistor)
   - Add CO2 sensor (MQ-135 or SCD30)
5. **Power Optimization**: Add deep sleep mode to save battery
6. **OTA Updates**: Enable over-the-air firmware updates

## Additional Resources

- [ESP32 Pinout Reference](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)
- [DHT Sensor Library Documentation](https://github.com/adafruit/DHT-sensor-library)
- [ArduinoJson Documentation](https://arduinojson.org/)
- [PlatformIO Documentation](https://docs.platformio.org/)

## Support

If you encounter issues:
1. Check the Serial Monitor output for error messages
2. Verify all wiring connections
3. Test backend API with curl/Postman
4. Review the troubleshooting section above
