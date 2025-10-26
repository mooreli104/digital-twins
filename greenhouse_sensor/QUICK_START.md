# ESP32 Quick Start Checklist

Follow this checklist to get your ESP32 greenhouse sensors up and running in 10 minutes.

## Hardware Setup (5 minutes)

### [ ] Step 1: Gather Components
- [ ] ESP32 development board
- [ ] DHT11 sensor module
- [ ] Soil moisture sensor
- [ ] USB cable
- [ ] Breadboard (optional)
- [ ] Jumper wires

### [ ] Step 2: Wire Connections

**DHT11 (Temperature & Humidity):**
- [ ] DHT11 VCC → ESP32 3.3V
- [ ] DHT11 GND → ESP32 GND
- [ ] DHT11 DATA → ESP32 GPIO 4

**Soil Moisture Sensor:**
- [ ] Sensor VCC → ESP32 3.3V
- [ ] Sensor GND → ESP32 GND
- [ ] Sensor AOUT → ESP32 GPIO 34

### [ ] Step 3: Connect USB
- [ ] Connect ESP32 to computer via USB cable
- [ ] Verify power LED lights up on ESP32

---

## Software Setup (5 minutes)

### [ ] Step 4: Configure WiFi and Backend

Open [src/main.cpp](src/main.cpp) and update:

```cpp
// Line 29-30: Your WiFi credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Line 35: Your computer's IP address
const char* API_ENDPOINT = "http://192.168.1.XXX:3001/api/sensors/data";
```

**Find your computer's IP:**

Windows:
```bash
ipconfig
```

macOS/Linux:
```bash
ifconfig
```

Replace `192.168.1.XXX` with your actual IP address.

### [ ] Step 5: Start Backend Server

In a terminal:
```bash
cd backend
npm install
npm start
```

Verify you see:
```
Server running on port 3001
```

### [ ] Step 6: Upload to ESP32

In VS Code with PlatformIO:
- [ ] Click **Upload** button (→) in bottom toolbar
- [ ] Wait for "SUCCESS" message

### [ ] Step 7: Open Serial Monitor

- [ ] Click **Serial Monitor** button (plug icon)
- [ ] Set baud rate to **115200**
- [ ] Press RESET button on ESP32

---

## Verification (2 minutes)

### [ ] Step 8: Check Serial Output

You should see:
```
✓ WiFi Connected!
IP Address: 192.168.1.XXX

📊 Sensor Readings:
  🌡️  Temperature:   72.5°F
  💧 Humidity:      65.3%
  🌱 Soil Moisture: 45.2%

✓ HTTP Response Code: 200
Response: {"success":true,...}
```

### [ ] Step 9: Verify Backend Receives Data

In the backend terminal, you should see:
```
Received sensor data from ESP32: {
  temperature: 72.5,
  humidity: 65.3,
  soil_moisture: 45.2,
  ...
}
```

### [ ] Step 10: Test API Endpoint

In a browser or new terminal:
```bash
curl http://localhost:3001/api/sensors/current
```

Should return latest sensor data:
```json
{
  "success": true,
  "data": {
    "temperature": 72.5,
    "humidity": 65.3,
    "soil_moisture": 45.2,
    "light_level": 600,
    "co2_ppm": 700,
    "timestamp": "2025-10-25T22:30:00.000Z"
  }
}
```

---

## Troubleshooting

### WiFi Connection Failed
- [ ] Check SSID and password are correct
- [ ] Ensure ESP32 is within WiFi range
- [ ] Verify WiFi is 2.4GHz (ESP32 doesn't support 5GHz)

### HTTP Error -1
- [ ] Verify backend is running (`npm start`)
- [ ] Check IP address in code matches your computer's IP
- [ ] Test endpoint with curl from another device
- [ ] Check firewall allows port 3001

### Sensor Shows NaN or 0
- [ ] Double-check wiring connections
- [ ] Ensure DHT11 VCC is 3.3V
- [ ] Wait 2 seconds after ESP32 reset
- [ ] Try pressing RESET button on ESP32

### No Serial Output
- [ ] Verify baud rate is 115200
- [ ] Press RESET button on ESP32
- [ ] Try different USB cable/port
- [ ] Check USB drivers are installed

---

## Next Steps

Once everything works:

1. **Calibrate Soil Sensor** (see [README.md](README.md#soil-moisture-sensor-calibration))
   - Measure dry value (sensor in air)
   - Measure wet value (sensor in water)
   - Update calibration constants in code

2. **Test Frontend Integration**
   - Start React frontend
   - Check if sensor data appears in dashboard

3. **Add WebSocket Support**
   - Implement Socket.io broadcasting
   - Real-time updates to frontend

4. **Database Integration**
   - Connect to Supabase
   - Save historical sensor data

5. **Add More Sensors** (optional)
   - Light sensor (BH1750)
   - CO2 sensor (MQ-135)

---

## Data Flow Verification

```
✓ ESP32 reads sensors every 2 seconds
  ↓
✓ Sends JSON via WiFi to backend
  ↓
✓ Backend receives on POST /api/sensors/data
  ↓
✓ Backend stores in memory (latestSensorData)
  ↓
✓ Frontend can query via GET /api/sensors/current
  ↓
✓ Data appears in dashboard
```

---

## Resources

- **Detailed Guide**: [README.md](README.md)
- **Wiring Diagram**: [WIRING.txt](WIRING.txt)
- **Code Reference**: [src/main.cpp](src/main.cpp)
- **Backend API**: [../backend/routes/api.js](../backend/routes/api.js)

---

## Success Checklist

If you can check all these, you're done:

- [x] ESP32 connects to WiFi
- [x] Sensors provide readings (not NaN or errors)
- [x] Serial Monitor shows sensor data
- [x] Backend receives HTTP POST requests
- [x] GET /api/sensors/current returns latest data
- [x] No errors in backend console
- [x] Data updates every 2 seconds

**Congratulations! Your ESP32 greenhouse sensor system is operational!**
