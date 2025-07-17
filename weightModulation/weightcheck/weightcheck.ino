#include "HX711.h"

#define DT 2   // D2 (GPIO 4)
#define SCK 4  // D4 (GPIO 2)

HX711 scale;

void setup() {
  Serial.begin(115200);
  scale.begin(DT, SCK);
  
  scale.set_scale(112.82417);   // your calibration factor
  scale.tare();            // zero the scale

  Serial.println("SmartBill AI – Weight Monitoring Started...");
}

void loop() {
  float weight = scale.get_units(5);  // average of 5 readings

  Serial.print("Weight: ");
  Serial.print(weight, 2);
  Serial.println(" g");

  delay(500);  // update every 0.5 second
}
