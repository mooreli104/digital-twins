/*
 * ESP32 Greenhouse Sensor System
 *
 * Hardware Connected:
 * - DHT11 sensor (Temperature & Humidity) on GPIO 4
 * - Soil Moisture sensor (Analog) on GPIO 34
 *
 * Physical Measurements:
 * - Temperature (°F) - from DHT11
 * - Humidity (%) - from DHT11
 * - Soil Moisture (%) - from analog moisture sensor
 *
 * Simulated Values (sent to match backend data structure):
 * - Light Level - uses simulator's base value (600 lux)
 * - CO2 PPM - uses simulator's base value (700 ppm)
 *
 * Features:
 * - Reads 3 physical sensors (DHT11 temp/humidity + soil moisture)
 * - Connects to WiFi automatically
 * - Sends data to backend API every 2 seconds (matches simulator)
 * - Includes simulated light/CO2 values so simulator can continue providing those
 *
 * Libraries Required:
 * - DHT sensor library (Adafruit)
 * - ArduinoJson
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// ========== CONFIGURATION ==========
// WiFi credentials - CHANGE THESE TO YOUR NETWORK
const char* WIFI_SSID = "NETGEAR30";
const char* WIFI_PASSWORD = "younghippo640";

// Backend API endpoint for ESP32 hardware data - Your computer's IP
const char* API_ENDPOINT = "http://192.168.1.29:3001/api/sensors/esp32";

// Sensor update interval (milliseconds) - 2 seconds matches simulator
const unsigned long UPDATE_INTERVAL = 2000;

// ========== HARDWARE PIN CONFIGURATION ==========
#define DHT_PIN 4              // DHT11 data pin connected to GPIO 4
#define SOIL_MOISTURE_PIN 34   // Soil moisture sensor on GPIO 34 (ADC1_CH6)
#define DHT_TYPE DHT11         // DHT sensor type

// ========== SENSOR OBJECTS ==========
DHT dht(DHT_PIN, DHT_TYPE);

// ========== GLOBAL VARIABLES ==========
unsigned long lastUpdate = 0;
int readingCount = 0;

// ========== FUNCTION DECLARATIONS ==========
void connectWiFi();
float readTemperature();
float readHumidity();
float readSoilMoisture();
void sendSensorData(float temp, float humidity, float soilMoisture, float light, float co2);
void printSensorReadings(float temp, float humidity, float soilMoisture, float light, float co2);

// ========== SETUP ==========
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n========================================");
  Serial.println("ESP32 Greenhouse Sensor System");
  Serial.println("========================================\n");

  // Initialize DHT sensor
  Serial.println("Initializing DHT11 sensor...");
  dht.begin();
  delay(2000); // DHT sensors need time to stabilize
  Serial.println("DHT11 initialized!");

  // Initialize soil moisture sensor (analog pin)
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  Serial.println("Soil moisture sensor initialized!");

  // Connect to WiFi
  connectWiFi();

  Serial.println("\nSetup complete! Starting sensor readings...\n");
}

// ========== MAIN LOOP ==========
void loop() {
  // Check if it's time to read sensors
  unsigned long currentMillis = millis();

  if (currentMillis - lastUpdate >= UPDATE_INTERVAL) {
    lastUpdate = currentMillis;
    readingCount++;

    Serial.println("----------------------------------------");
    Serial.printf("Reading #%d\n", readingCount);
    Serial.println("----------------------------------------");

    // Read physical sensors (DHT11 + Soil Moisture)
    float temperature = readTemperature();    // From DHT11
    float humidity = readHumidity();          // From DHT11
    float soilMoisture = readSoilMoisture();  // From analog sensor

    // Simulated values (let Python simulator handle these)
    // These are placeholder values matching simulator's base config
    float lightLevel = 600.0;  // Simulator will provide actual light patterns
    float co2Ppm = 700.0;      // Simulator will provide actual CO2 patterns

    // Print readings to serial monitor
    printSensorReadings(temperature, humidity, soilMoisture, lightLevel, co2Ppm);

    // Send data to backend
    if (WiFi.status() == WL_CONNECTED) {
      sendSensorData(temperature, humidity, soilMoisture, lightLevel, co2Ppm);
    } else {
      Serial.println("⚠ WiFi disconnected! Attempting to reconnect...");
      connectWiFi();
    }

    Serial.println();
  }
}

// ========== WIFI CONNECTION ==========
void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  Serial.printf("SSID: %s\n", WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("API Endpoint: %s\n", API_ENDPOINT);
  } else {
    Serial.println("\n✗ WiFi Connection Failed!");
    Serial.println("Please check your WiFi credentials and try again.");
  }
}

// ========== SENSOR READING FUNCTIONS ==========

float readTemperature() {
  float temp = dht.readTemperature(true); // true = Fahrenheit

  if (isnan(temp)) {
    Serial.println("⚠ Failed to read temperature from DHT11!");
    return 75.0; // Return default value if sensor fails
  }

  return temp;
}

float readHumidity() {
  float humidity = dht.readHumidity();

  if (isnan(humidity)) {
    Serial.println("⚠ Failed to read humidity from DHT11!");
    return 70.0; // Return default value if sensor fails
  }

  return humidity;
}

float readSoilMoisture() {
  // Read analog value from soil moisture sensor
  // ESP32 ADC: 0-4095 (12-bit resolution)
  int rawValue = analogRead(SOIL_MOISTURE_PIN);

  // Convert to percentage (0-100%)
  // Typical soil moisture sensors:
  // - Dry soil: ~3000-4095
  // - Wet soil: ~1000-1500
  // Adjust these values based on your sensor calibration

  const int DRY_VALUE = 3000;   // Sensor value in dry soil
  const int WET_VALUE = 1500;   // Sensor value in wet soil

  // Map the raw value to percentage (inverted: higher raw value = drier soil)
  float moisturePercent = map(rawValue, DRY_VALUE, WET_VALUE, 0, 100);

  // Constrain to 0-100%
  moisturePercent = constrain(moisturePercent, 0, 100);

  return moisturePercent;
}

// ========== DATA TRANSMISSION ==========

void sendSensorData(float temp, float humidity, float soilMoisture, float light, float co2) {
  HTTPClient http;

  Serial.println("\nSending data to backend...");

  // Create JSON document
  // Send to ESP32-specific endpoint: /api/sensors/esp32
  StaticJsonDocument<256> doc;
  doc["temperature"] = round(temp * 10) / 10.0;  // Round to 1 decimal
  doc["humidity"] = round(humidity * 10) / 10.0;
  doc["soil_moisture"] = round(soilMoisture * 10) / 10.0;
  doc["light_level"] = round(light * 10) / 10.0;
  doc["co2_ppm"] = round(co2 * 10) / 10.0;

  // Serialize to JSON string
  String jsonString;
  serializeJson(doc, jsonString);

  Serial.printf("JSON Payload: %s\n", jsonString.c_str());

  // Send HTTP POST request
  http.begin(API_ENDPOINT);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonString);

  // Check response
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("✓ HTTP Response Code: %d\n", httpResponseCode);
    Serial.printf("Response: %s\n", response.c_str());
  } else {
    Serial.printf("✗ Error sending data. Error code: %d\n", httpResponseCode);
    Serial.printf("Error: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// ========== HELPER FUNCTIONS ==========

void printSensorReadings(float temp, float humidity, float soilMoisture, float light, float co2) {
  Serial.println("\n📊 Sensor Readings:");
  Serial.println("  ─── Physical Sensors ───");
  Serial.printf("  🌡️  Temperature:   %.1f°F (DHT11)\n", temp);
  Serial.printf("  💧 Humidity:      %.1f%% (DHT11)\n", humidity);
  Serial.printf("  🌱 Soil Moisture: %.1f%% (Analog Sensor)\n", soilMoisture);
  Serial.println("  ─── From Simulator ───");
  Serial.printf("  💡 Light Level:   %.1f lux (Python simulator)\n", light);
  Serial.printf("  🌫️  CO2 Level:     %.1f ppm (Python simulator)\n", co2);
}
