import processing.serial.*;   // library for Serial
import http.requests.*;       // library for HTTP Request

Serial myPort;   // Serial class object
String microphoneValue; // Variable to store microphone data from Arduino

void setup() {
  // List all available serial ports
  println(Serial.list());
  
  // Initialize the serial port
  myPort = new Serial(this, Serial.list()[0], 9600);
}

void draw() {
  // Check if there is any serial data available
  if (myPort.available() > 0) {
    // Read the serial data from Arduino
    microphoneValue = myPort.readStringUntil('\n');
    
    // If statement to make sure that value is not null
    if (microphoneValue != null) {
      microphoneValue = trim(microphoneValue); //Trim the whitespaces in value
      
      // Print the microphone value
      println("Microphone value: " + microphoneValue);
      
      if (frameCount % 60 == 0) { //Prints value every 1 second, 60 means 60 frames
      // Send the microphone value to the Node.js server
      sendMicDataToServer(microphoneValue);
      }
    }
  }
}

// Function to send microphone data to the Node.js server
void sendMicDataToServer(String micValue) {
  // Create a new HTTP POST request
  PostRequest post = new PostRequest("http://localhost:3000/sentiment"); // Use /sentiment to send mic data for analysis

  // Add the header and JSON data for the POST request
  post.addHeader("Content-Type", "application/json");
  post.addData("{\"micValue\":\"" + micValue + "\"}"); // Sending micValue to the server
  
  // Send the POST request
  try {
    post.send();
  
    // Handle the response from the server
    String response = post.getContent();
    if (response != null) {
      println("Server response: " + response);
    } else {
      println("No response from server.");
    }
  } catch (Exception e) {
    println("Error: " + e.getMessage());
  }
}
