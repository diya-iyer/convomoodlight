import processing.serial.*;   // Serial library
import http.requests.*;       // HTTP request library

Serial myPort;   // Create object from Serial class
String micValue; // Variable to store microphone data from Arduino

void setup() {
  // List all available serial ports
  println(Serial.list());
  
  // Initialize the serial port (replace 0 with the correct index for your Arduino)
  myPort = new Serial(this, Serial.list()[0], 9600);
}

void draw() {
  // Check if there is any serial data available
  if (myPort.available() > 0) {
    // Read the serial data from Arduino
    micValue = myPort.readStringUntil('\n');
    
    // Ensure the microphone value is non-null and trimmed of whitespace
    if (micValue != null) {
      micValue = trim(micValue);
      
      // Print the microphone value to the Processing console
      println("Microphone value: " + micValue);
      
      // Send the microphone value to the Node.js server
      sendMicDataToServer(micValue);
    }
  }
}

// Function to send microphone data to the Node.js server
void sendMicDataToServer(String micValue) {
  // Create a new HTTP POST request
  PostRequest post = new PostRequest("http://localhost:3000/microphone");

  // Set the appropriate header and JSON data for the POST request
  post.addHeader("Content-Type", "application/json");
  post.addData("{\"micValue\":\"" + micValue + "\"}");
  
  // Send the POST request
  post.send();
  
  // Handle the response from the server
  String response = post.getContent();
  if (response != null) {
    println("Server response: " + response);
  } else {
    println("No response from server.");
  }
}
