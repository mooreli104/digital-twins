# Supabase Database Schema

## Tables

### 1. users (Built-in Supabase Auth)
- Managed automatically by Supabase Auth
- Contains: id, email, created_at, etc.

### 2. greenhouses
Stores greenhouse configuration and metadata.

```sql
CREATE TABLE greenhouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  crop_type VARCHAR(100) DEFAULT 'tomatoes',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. sensor_history
Stores historical sensor readings (batched every 5 minutes from Redis).

```sql
CREATE TABLE sensor_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  greenhouse_id UUID REFERENCES greenhouses(id) ON DELETE CASCADE,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  soil_moisture DECIMAL(5,2),
  light_level DECIMAL(6,2),
  co2 DECIMAL(6,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_sensor_history_greenhouse_time
ON sensor_history(greenhouse_id, timestamp DESC);
```

### 4. alerts
Stores alert history and status.

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  greenhouse_id UUID REFERENCES greenhouses(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'critical', 'warning', 'info'
  sensor VARCHAR(50), -- 'temperature', 'soil_moisture', etc.
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Index for active alerts
CREATE INDEX idx_alerts_greenhouse_active
ON alerts(greenhouse_id, resolved, created_at DESC);
```

### 5. irrigation_events (Optional - for water savings calculation)
Tracks when irrigation occurs (simulated or real).

```sql
CREATE TABLE irrigation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  greenhouse_id UUID REFERENCES greenhouses(id) ON DELETE CASCADE,
  water_amount DECIMAL(5,2), -- gallons
  triggered_by VARCHAR(50), -- 'manual', 'auto', 'alert'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

Enable RLS for multi-user support:

```sql
-- Enable RLS
ALTER TABLE greenhouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own greenhouses
CREATE POLICY "Users can view own greenhouses"
ON greenhouses FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only see data from their greenhouses
CREATE POLICY "Users can view own sensor history"
ON sensor_history FOR SELECT
USING (
  greenhouse_id IN (
    SELECT id FROM greenhouses WHERE user_id = auth.uid()
  )
);
```

## Sample Data (For Testing)

```sql
-- Insert a test greenhouse
INSERT INTO greenhouses (user_id, name, crop_type)
VALUES (
  'your-user-uuid-here',
  'Main Greenhouse',
  'tomatoes'
);
```

## Notes

- **Redis** stores real-time data (last 60 seconds)
- **Supabase** stores historical data (5-minute batches)
- Use backend to batch writes to Supabase (avoid hitting rate limits)
