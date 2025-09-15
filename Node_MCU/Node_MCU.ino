#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiClientSecure.h>
#include "config.h"  // Contains all WiFi and Twilio credentials

const char* ssid_sta = WIFI_SSID_my;
const char* password_sta = WIFI_PASS_my;
const char* ssid_ap = WIFI_SSID_8266;
const char* password_ap = WIFI_PASS_8266;

const char* twilio_sid = TWILIO_ACCOUNT_SID;
const char* twilio_token = TWILIO_AUTH_TOKEN;
const char* twilio_from = TWILIO_PHONE_NUMBER; // +1234567890

ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);
  
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid_sta, password_sta);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  Serial.print("STA IP: "); Serial.println(WiFi.localIP());

  WiFi.softAP(ssid_ap, password_ap);
  Serial.print("AP started. IP: "); Serial.println(WiFi.softAPIP());

  server.on("/send_sms", []() {
    String to = server.arg("to");
    String msg = server.arg("msg");

    if (to == "" || msg == "") {
      server.send(400, "text/plain", "Missing 'to' or 'msg' parameter");
      return;
    }

    String response = sendSMS(to, msg);
    server.send(200, "application/json", response);
  });

  server.begin();
  Serial.println("Server started.");
}

void loop() {
  server.handleClient();
}

String sendSMS(String to, String msg) {
  WiFiClientSecure client;
  client.setInsecure();  // Skip cert check for simplicity

  if (!client.connect("api.twilio.com", 443)) {
    return "{\"error\":\"Failed to connect to Twilio\"}";
  }

  String url = "/2010-04-01/Accounts/" + String(twilio_sid) + "/Messages.json";
  String data = "To=" + to + "&From=" + String(twilio_from) + "&Body=" + msg;

  String auth = base64::encode(String(twilio_sid) + ":" + String(twilio_token));
  client.println("POST " + url + " HTTP/1.1");
  client.println("Host: api.twilio.com");
  client.println("Authorization: Basic " + auth);
  client.println("Content-Type: application/x-www-form-urlencoded");
  client.print("Content-Length: "); client.println(data.length());
  client.println(); client.print(data);

  // Read the response
  String line, response;
  while (client.connected()) {
    line = client.readStringUntil('\n');
    response += line + "\n";
    if (line == "\r") break;
  }
  response += client.readString();

  return response;
}
