# ESP32 Quick Test Guide

## Start Everything (3 Commands)

### Terminal 1: Backend
```bash
cd backend
npm start
```
✅ Should see: `Server running on port 3001`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
✅ Should see: `Local: http://localhost:5173/`

### Terminal 3: Test ESP32 Endpoint (Without Hardware)
```bash
curl -X POST http://localhost:3001/api/sensors/esp32 \
  -H "Content-Type: application/json" \
  -d '{"temperature":99,"humidity":88,"soil_moisture":77}'
```
✅ Should see: `{"success":true,...}`
✅ Frontend dashboard should update to 99°F!

---

## With Real ESP32 Hardware

### 1. Update Code (One Time)
```cpp
// greenhouse_sensor/src/main.cpp lines 38-43
const char* WIFI_SSID = "YourWiFiName";
const char* WIFI_PASSWORD = "YourPassword";
const char* API_ENDPOINT = "http://YOUR_IP:3001/api/sensors/esp32";
```

**Find your IP**:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

### 2. Upload to ESP32
- Open `greenhouse_sensor` in PlatformIO
- Click Upload button (→)
- Open Serial Monitor (115200 baud)

### 3. Watch Serial Output
```
✓ WiFi Connected!
✓ HTTP Response Code: 200
```

### 4. Check Frontend
- `http://localhost:5173`
- Should see: **"ESP32 Hardware Connected"** with green dot
- Sensor values update every 2 seconds

---

## Quick Test: Is It Working?

**Breathe on DHT11 sensor** → Temperature/humidity should increase in dashboard within 2 seconds!

---

## Files to Configure

| What | Where | Line |
|------|-------|------|
| WiFi SSID | `greenhouse_sensor/src/main.cpp` | 38 |
| WiFi Password | `greenhouse_sensor/src/main.cpp` | 39 |
| API Endpoint IP | `greenhouse_sensor/src/main.cpp` | 43 |

---

## Troubleshooting 1-Liners

| Problem | Solution |
|---------|----------|
| "Waiting for ESP32..." | Check backend is running, ESP32 WiFi connected |
| "WiFi Connection Failed" | Check SSID/password, use 2.4GHz WiFi |
| "HTTP Error -1" | Check IP address matches your computer |
| "NaN" on sensors | Check wiring, press RESET on ESP32 |

---

## Architecture
```
ESP32 → POST /api/sensors/esp32 → Backend → WebSocket → Frontend
  ↑                                    ↓
DHT11 + Soil                    Socket.io 'esp32-update'
```

**That's it!** See [ESP32_INTEGRATION_COMPLETE.md](ESP32_INTEGRATION_COMPLETE.md) for full details.
