# FarmTwin - Digital Greenhouse Dashboard

> Precision agriculture for small-scale farmers through real-time monitoring and smart alerts

## Overview

**FarmTwin** is a digital twin dashboard for greenhouse monitoring that helps small-scale farmers optimize resource usage through real-time sensor data, predictive alerts, and sustainability metrics.

**The Problem**: Agriculture uses 70% of global freshwater, but 50% is wasted through inefficient irrigation. Small-scale greenhouse farmers lack affordable tools to optimize resource use.

**Our Solution**: A digital twin platform that provides precision agriculture capabilities at zero hardware cost, using simulated sensors that can easily be swapped for real IoT devices.

## Key Features

### 1. Live Dashboard
- Real-time sensor monitoring (temperature, humidity, soil moisture, light, CO2)
- Color-coded status indicators (optimal/warning/critical)
- Interactive charts with trend visualization
- Updates every 2 seconds via WebSocket

### 2. Smart Alerts
- Automatic threshold detection
- Instant notifications for critical conditions
- Context-aware alerts based on tomato growing requirements
- Alert history and resolution tracking

### 3. Water Savings Tracker
- Real-time calculation vs. traditional watering schedules
- Daily and weekly savings metrics
- Demonstrates 30-40% water reduction
- Sustainability impact visualization

### 4. Optimal Range Indicators
- Visual status for each sensor
- Tomato-specific optimal ranges
- Progress bars showing current values
- Educational context for growers

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Sensor Simulation** | Python | Generate realistic greenhouse data |
| **Real-time Cache** | Redis | Pub/sub for live updates, ultra-fast access |
| **Backend** | Node.js + Express | WebSocket server, business logic, API |
| **Database** | Supabase | Auth, persistent storage, historical data |
| **Frontend** | React + Vite | Live dashboard, interactive UI |
| **Charts** | Recharts | Real-time data visualization |
| **WebSocket** | Socket.io | Bidirectional real-time communication |
| **Styling** | Tailwind CSS | Responsive, modern UI |

## Project Structure

```
digital-twins/
├── simulator/          # Python sensor data generator
├── backend/            # Node.js WebSocket + REST API
├── frontend/           # React dashboard UI
├── DATABASE_SCHEMA.md  # Supabase SQL schema
├── SETUP_GUIDE.md      # Installation instructions
└── PROJECT_STRUCTURE.md # Architecture details
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Redis (local or cloud)
- Supabase account (free tier)

### Installation

1. **Clone and navigate**
   ```bash
   cd digital-twins
   ```

2. **Setup Python simulator**
   ```bash
   cd simulator
   pip install -r requirements.txt
   python sensor_simulator.py
   ```

3. **Setup Node.js backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   npm run dev
   ```

4. **Setup React frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   npm run dev
   ```

5. **Open dashboard**
   Navigate to http://localhost:5173

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## Architecture

```
Python Simulator → Redis (Pub/Sub) → Node.js Backend → WebSocket → React Frontend
                                    ↓
                                Supabase (Auth + History)
```

**Data Flow**:
1. Python generates realistic sensor data every 2 seconds
2. Redis stores latest values and publishes updates
3. Node.js subscribes to updates, checks thresholds, calculates metrics
4. WebSocket broadcasts to all connected clients
5. React displays live data, charts, and alerts
6. Supabase stores historical data and user configuration

## Sustainability Core

FarmTwin demonstrates measurable environmental impact:

- **30-40% water reduction** vs. fixed-schedule irrigation
- **Smart alerts** prevent resource waste from neglect
- **Accessible technology** democratizes precision agriculture
- **Scalable approach** for urban farms, community gardens, schools

### Impact Metrics
- Water saved per day/week
- Optimal range adherence score
- Resource efficiency tracking
- Environmental benefit visualization

## Use Cases

- **Urban farms**: Maximize yield in limited space
- **Community gardens**: Shared monitoring platform
- **Educational institutions**: Teach sustainable agriculture
- **Hobbyist growers**: Professional-grade insights
- **Proof of concept**: Demonstrate IoT integration before hardware investment

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-greenhouse management
- [ ] Crop type profiles (lettuce, peppers, strawberries)
- [ ] Historical playback (rewind sensor data)
- [ ] Growth stage tracking
- [ ] Real sensor integration (Arduino, Raspberry Pi)
- [ ] Weather API integration
- [ ] Automated irrigation control

## Team

Built for [Hackathon Name] 2025

## License

MIT

---

**Live monitoring. Smart alerts. Sustainable farming.**
