#include <WiFi.h>
#include <WebServer.h>
#include "HX711.h"
#include "config.h" // Getting the WIFI_SSID, WIFI_PASS


WebServer server(80);
String terminalData = "No data received yet.";  // Default message

#define DOUT  4  // HX711 Data Pin
#define CLK   5  // HX711 Clock Pin

HX711 scale;

void handleDataRequest() {
    server.send(200, "text/plain", terminalData);
}

void handleLoadRequest() {
    if (scale.is_ready()) {
        long weight = scale.get_units(10); // Get average of 10 readings
        server.send(200, "text/plain", "Weight: " + String(weight) + " g");
    } else {
        server.send(200, "text/plain", "HX711 not ready");
    }
}

void setup() {
    Serial.begin(115200);
    
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");
    Serial.println("IP Address: " + WiFi.localIP().toString());
    
    scale.begin(DOUT, CLK);
    scale.set_scale(); // Set scale calibration factor if needed
    scale.tare();      // Reset scale to 0
    
    server.on("/data", handleDataRequest); // Endpoint to fetch terminal data
    server.on("/load", handleLoadRequest); // New endpoint to get weight data
    server.begin();
    Serial.println("Server started. Access data at: http://" + WiFi.localIP().toString() + "/data");
    Serial.println("Access weight data at: http://" + WiFi.localIP().toString() + "/load");
}

void loop() {
    server.handleClient();
    
    if (Serial.available() > 0) {
        String newData = Serial.readStringUntil('\n');
        newData.trim();
        if (!newData.isEmpty()) {
            terminalData = newData;
            Serial.println("Updated data: " + terminalData);
        }
    }
}
