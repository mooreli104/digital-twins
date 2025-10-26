/*
 * ESP32 Greenhouse Sensor System - TEST MODE
 *
 * Hardware Connected:
 * - DHT11 sensor (Temperature & Humidity) on GPIO 4
 * - Soil Moisture sensor (Analog) on GPIO 34
 *
 * This version just reads sensors and prints to Serial Monitor
 * No WiFi or API calls - perfect for testing hardware!
 */

#include <Arduino.h>
#include <DHT.h>

// ========== HARDWARE PIN CONFIGURATION ==========
#define DHT_PIN 4              // DHT11 data pin connected to GPIO 4
#define SOIL_MOISTURE_PIN 34   // Soil moisture sensor on GPIO 34 (ADC1_CH6)
#define DHT_TYPE DHT11         // DHT sensor type

// ========== SENSOR OBJECTS ==========
DHT dht(DHT_PIN, DHT_TYPE);

// ========== GLOBAL VARIABLES ==========
int readingCount = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n========================================");
  Serial.println("ESP32 Greenhouse Sensor Test");
  Serial.println("========================================\n");

  // Initialize DHT sensor
  Serial.println("Initializing DHT11 sensor...");
  dht.begin();
  delay(2000); // DHT sensors need time to stabilize
  Serial.println("✓ DHT11 initialized!");

  // Initialize soil moisture sensor (analog pin)
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  Serial.println("✓ Soil moisture sensor initialized!");

  Serial.println("\nSetup complete! Starting sensor readings...\n");
}

void loop() {
  readingCount++;

  Serial.println("========================================");
  Serial.printf("Reading #%d\n", readingCount);
  Serial.println("========================================");

  // ===== READ DHT11 SENSOR =====
  float temperature = dht.readTemperature(true); // true = Fahrenheit
  float humidity = dht.readHumidity();

  // Check if DHT readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("⚠️  ERROR: Failed to read from DHT11 sensor!");
    Serial.println("   Check wiring:");
    Serial.println("   - VCC -> 3.3V");
    Serial.println("   - GND -> GND");
    Serial.println("   - DATA -> GPIO 4");
  } else {
    Serial.println("📊 DHT11 Sensor:");
    Serial.printf("   🌡️  Temperature: %.1f°F\n", temperature);
    Serial.printf("   💧 Humidity:    %.1f%%\n", humidity);
  }

  // ===== READ SOIL MOISTURE SENSOR =====
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);

  // Convert to percentage
  // Calibration values (adjust these for your sensor!):
  const int DRY_VALUE = 3000;   // Sensor value in dry soil/air
  const int WET_VALUE = 1500;   // Sensor value in wet soil/water

  // Map the raw value to percentage (inverted: higher raw value = drier soil)
  float moisturePercent = map(soilMoistureRaw, DRY_VALUE, WET_VALUE, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  Serial.println("\n📊 Soil Moisture Sensor:");
  Serial.printf("   Raw Value:      %d (0-4095)\n", soilMoistureRaw);
  Serial.printf("   🌱 Moisture:     %.1f%%\n", moisturePercent);

  // Interpretation guide
  Serial.print("   Status:         ");
  if (moisturePercent < 30) {
    Serial.println("🟥 DRY - Needs water!");
  } else if (moisturePercent < 60) {
    Serial.println("🟨 MODERATE - OK");
  } else {
    Serial.println("🟩 WET - Well watered");
  }

  Serial.println("\n========================================\n");

  // Wait 2 seconds between readings
  delay(2000);
}
