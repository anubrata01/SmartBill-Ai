#include "HX711.h"

#define DOUT  2   // DT pin
#define CLK   4   // SCK pin

HX711 scale;

void setup() {
  Serial.begin(115200);
  scale.begin(DOUT, CLK);

  Serial.println("Remove all weight from the scale...");
  delay(3000);
  scale.tare();  // Reset the scale to 0

  Serial.println("Place a known weight on the scale...");
  delay(5000); // Wait for user to place weight

  long reading = scale.get_units(10);  // Average of 10 readings
  Serial.print("Raw reading: ");
  Serial.println(reading);

  Serial.println("Enter the known weight (grams) in the Serial Monitor:");
}

void loop() {
  if (Serial.available() > 0) {
    float known_weight = Serial.parseFloat();

    long reading = scale.get_units(10); // Get current average reading

    float calibration_factor = reading / known_weight;
    Serial.print("Calibration Factor = ");
    Serial.println(calibration_factor, 5);  // 5 decimal points

    Serial.println("Use this calibration factor in your main code.");
    while (1); // Stop loop after calibration
  }
}
