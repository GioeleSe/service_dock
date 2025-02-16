#include <Arduino.h>
#include <WiFiManager.h>
#include <HTTPClient.h>

enum HTTPReq {
  HEAD,
  GET,
  POST,
  PUT
};
const char* httpReqToString(HTTPReq req) {
  switch (req) {
    case HTTPReq::HEAD: return "HEAD";
    case HTTPReq::GET: return "GET";
    case HTTPReq::POST: return "POST";
    case HTTPReq::PUT: return "PUT";
    default: return "Unknown"; 
  }
}

int sendHttpRequest(HTTPReq method, String url, String headers[] = NULL, int numHeaders = 0);

void setup() {
    Serial.begin(115200);


    // Automatically connect using saved credentials,
    // if connection fails, it starts an access point with the specified name ( "AutoConnectAP"),
    // then goes into a blocking loop awaiting configuration and will return success result.  
    // For more info check the repo https://github.com/tzapu/WiFiManager  
    WiFi.mode(WIFI_STA); // explicitly set STA(TION) mode
    WiFiManager wm;
    //wm.resetSettings(); // reset settings - clear stored credentials stored by the esp library

    if(!wm.autoConnect("WifiManagerAP","password")) {
      Serial.println("Failed to connect");
      delay(30000);   // might enter a loop, better avoid constant restart() calls
      ESP.restart();
    } 
    else {
      // will enter here if successfully connected to a provided wifi

      // example of generic httpRequest to the Internet @.@ 
      String apiEndPoint = "http://www.example.com";
      String headers[1] = {"Content-Type: application/json"};
      HTTPReq reqType = HTTPReq::HEAD;
      int resCode = sendHttpRequest(reqType, apiEndPoint, headers, 1);
      Serial.printf("Got response from %s to req %s: %d\n", apiEndPoint.c_str(), httpReqToString(reqType), resCode);
    }

}

void loop() {
}

/**
 * Sends an HTTP request (GET, POST, HEAD, etc.) to a specified URL.
 * @param method HTTP method (e.g., "GET", "POST", "HEAD")
 * @param url Endpoint URL (e.g., "http://www.google.com")
 * @param headers Optional array of headers (default is NULL)
 * @param numHeaders Number of headers (default is 0)
 */
int sendHttpRequest(HTTPReq method, String url, String headers[], int numHeaders) {
  HTTPClient http;

  // Begin the HTTP request
  http.begin(url);
  
  // Set custom headers if provided
  if (numHeaders > 0) {
    for (int i = 0; i < numHeaders; i++) {
      http.addHeader("Custom-Header", headers[i]);
    }
  }

  // Send the HTTP request using the specified method
  Serial.printf("Sending %s request to %s ...\n", httpReqToString(method), url.c_str());
  
 int httpCode = 0;
  // Use the HTTPReq enum directly to send the correct request
  switch (method) {
    case HTTPReq::GET:
      httpCode = http.GET();
      break;
    case HTTPReq::POST:
      httpCode = http.POST(""); // Send payload if required
      break;
    case HTTPReq::HEAD:
      httpCode = http.sendRequest("HEAD");
      break;
    case HTTPReq::PUT:
      httpCode = http.PUT(""); // Send payload if required
      break;
    default:
      Serial.println("Unsupported HTTP method");
      return 0;
  }

  if (httpCode > 0) {
    // If we got a successful response, print the headers
    Serial.printf("HTTP Status Code: %d\n", httpCode);
    String payload = http.getString();
    Serial.println("Response Headers:");
    Serial.println(payload);
  } else {
    // If the request failed, print the error
    Serial.printf("Error occurred: %s\n", http.errorToString(httpCode).c_str());
  }

  // Close the HTTP connection
  http.end();

  return httpCode;
}