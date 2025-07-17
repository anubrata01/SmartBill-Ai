#include <WiFi.h>
#include <WebServer.h>
#include "HX711.h"
#include "config.h" // Replace with your WiFi SSID/PASS defines

// HX711 pins
#define DT 2   // D2 (GPIO 4)
#define SCK 4  // D4 (GPIO 2)

HX711 scale;
WebServer server(80);

void handleWeight() {
  if (scale.is_ready()) {
    float weight = scale.get_units(10);  // Average of 10 readings
    String result = "Weight: " + String(weight, 2);
    Serial.println(result);
    server.send(200, "text/plain", result);
  } else {
    server.send(503, "text/plain", "HX711 not ready");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing HX711...");

  scale.begin(DT, SCK);
  scale.set_scale(112.82417); // Set your calibration factor here (e.g., scale.set_scale(2280.0);)
  scale.tare();      // Reset scale to zero

  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID_clg_gnd, WIFI_PASS_clg_gnd);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected.");
  Serial.print("Web server at: http://");
  Serial.println(WiFi.localIP());
  Serial.println("  /weight");

  server.on("/weight", handleWeight);
  server.begin();
}

void loop() {
  server.handleClient();
}
