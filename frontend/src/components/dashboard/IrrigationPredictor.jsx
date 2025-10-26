// Irrigation Predictor Component
// Purpose: Predict when irrigation will be needed based on current soil moisture and water loss rate
//
// Calculates time until irrigation by:
// - Current soil moisture level
// - Water loss rate (from historical data)
// - Irrigation threshold (when automatic watering triggers)
// - Environmental factors (temperature, humidity)

import { useState, useEffect } from 'react';
import { Clock, Droplet, AlertTriangle, CheckCircle } from 'lucide-react';
import { getSensorHistory } from '../../services/api';

function IrrigationPredictor({ currentSoilMoisture, currentTemperature, currentHumidity }) {
  const [hoursUntilIrrigation, setHoursUntilIrrigation] = useState(null);
  const [waterLossRate, setWaterLossRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urgency, setUrgency] = useState('normal'); // 'critical', 'warning', 'normal', 'good'

  // Irrigation threshold (same as in Dashboard logic)
  const IRRIGATION_THRESHOLD = 30; // Trigger irrigation at 30% soil moisture

  // Calculate water loss rate and predict irrigation time
  useEffect(() => {
    const calculatePrediction = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent sensor data to calculate water loss rate
        const data = await getSensorHistory('24h');

        if (!data || data.length < 2) {
          setError('Insufficient historical data');
          setLoading(false);
          return;
        }

        // Reverse to chronological order
        const chronologicalData = data.reverse();

        // Calculate recent water loss rate (average of last few data points)
        let totalLossRate = 0;
        let validSamples = 0;

        for (let i = Math.max(0, chronologicalData.length - 10); i < chronologicalData.length; i++) {
          if (i === 0) continue;

          const prev = chronologicalData[i - 1];
          const curr = chronologicalData[i];

          // Calculate time difference in hours
          const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / (1000 * 60 * 60);

          if (timeDiff > 0 && timeDiff < 1) { // Only consider samples within 1 hour
            // Calculate soil moisture change
            const moistureChange = prev.soil_moisture - curr.soil_moisture;

            // Calculate base loss rate (% per hour)
            let lossRate = moistureChange / timeDiff;

            // Only count positive loss (ignore irrigation events)
            if (lossRate > 0 && lossRate < 5) { // Sanity check: max 5% per hour
              totalLossRate += lossRate;
              validSamples++;
            }
          }
        }

        let avgLossRate = validSamples > 0 ? totalLossRate / validSamples : 0.5; // Default to 0.5%/hr

        // Apply environmental adjustments based on current conditions
        // Higher temperature increases evapotranspiration
        const tempFactor = currentTemperature > 75 ? 1 + ((currentTemperature - 75) * 0.02) : 1;

        // Lower humidity increases evaporation
        const humidityFactor = currentHumidity < 65 ? 1 + ((65 - currentHumidity) * 0.01) : 1;

        // Adjusted loss rate
        const adjustedLossRate = avgLossRate * tempFactor * humidityFactor;

        setWaterLossRate(adjustedLossRate);

        // Calculate hours until irrigation needed
        if (currentSoilMoisture <= IRRIGATION_THRESHOLD) {
          setHoursUntilIrrigation(0);
          setUrgency('critical');
        } else {
          const moistureToLose = currentSoilMoisture - IRRIGATION_THRESHOLD;
          const hours = adjustedLossRate > 0 ? moistureToLose / adjustedLossRate : 999;
          setHoursUntilIrrigation(hours);

          // Determine urgency
          if (hours < 2) {
            setUrgency('critical');
          } else if (hours < 6) {
            setUrgency('warning');
          } else if (hours < 12) {
            setUrgency('normal');
          } else {
            setUrgency('good');
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error calculating irrigation prediction:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (currentSoilMoisture !== undefined && currentTemperature !== undefined && currentHumidity !== undefined) {
      calculatePrediction();
    }

    // Refresh every 5 minutes
    const interval = setInterval(calculatePrediction, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentSoilMoisture, currentTemperature, currentHumidity]);

  // Format hours to readable time
  const formatTime = (hours) => {
    if (hours === null || hours === undefined) return 'Calculating...';
    if (hours === 0) return 'Now!';
    if (hours > 72) return '> 3 days';

    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);

    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    } else if (remainingHours > 0) {
      return `${remainingHours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Get urgency styling
  const getUrgencyDisplay = () => {
    switch (urgency) {
      case 'critical':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          icon: <AlertTriangle className="w-6 h-6" />,
          label: 'Irrigation Needed Now',
          message: 'Soil moisture is at or below threshold. Irrigation is required immediately.'
        };
      case 'warning':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
          icon: <AlertTriangle className="w-6 h-6" />,
          label: 'Irrigation Soon',
          message: 'Irrigation will be needed soon. Monitor soil moisture closely.'
        };
      case 'normal':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
          icon: <Clock className="w-6 h-6" />,
          label: 'Irrigation Scheduled',
          message: 'Soil moisture is adequate. Irrigation will be needed later today.'
        };
      default: // 'good'
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Soil Well Hydrated',
          message: 'Soil moisture is optimal. No immediate irrigation needed.'
        };
    }
  };

  const urgencyDisplay = getUrgencyDisplay();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-gray-500">Calculating prediction...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Prediction Card */}
      <div className={`${urgencyDisplay.bgColor} ${urgencyDisplay.borderColor} border-2 rounded-lg p-6 mb-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`${urgencyDisplay.color} flex items-center gap-2`}>
            {urgencyDisplay.icon}
            <span className="font-semibold">{urgencyDisplay.label}</span>
          </div>
        </div>

        {/* Time Display */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">Time Until Irrigation</p>
          <p className={`text-5xl font-bold ${urgencyDisplay.color}`}>
            {formatTime(hoursUntilIrrigation)}
          </p>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-700 text-center">
          {urgencyDisplay.message}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Current Soil Moisture */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-600">Current Moisture</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {currentSoilMoisture?.toFixed(1)}%
          </p>
        </div>

        {/* Irrigation Threshold */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-gray-600">Threshold</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {IRRIGATION_THRESHOLD}%
          </p>
        </div>
      </div>

      {/* Water Loss Rate */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-600 mb-1">Estimated Water Loss Rate</p>
        <p className="text-xl font-bold text-gray-800">
          {waterLossRate.toFixed(3)} <span className="text-sm font-normal text-gray-600">%/hour</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Based on recent trends and current environmental conditions
        </p>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Prediction based on current soil moisture ({currentSoilMoisture?.toFixed(1)}%),
          water loss rate ({waterLossRate.toFixed(3)}%/hr), and irrigation threshold ({IRRIGATION_THRESHOLD}%).
          Accounts for temperature and humidity effects.
        </p>
      </div>
    </div>
  );
}

export default IrrigationPredictor;
