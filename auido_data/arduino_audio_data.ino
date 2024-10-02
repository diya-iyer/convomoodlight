const int redPin = 4;
const int greenPin = 3;
const int bluePin = 2;

void setup() {
  // Initialize the RGB LED pins as outputs
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // Start serial communication at 9600 baud rate
  Serial.begin(9600);
}

void loop() {
  // Check if there's incoming data from the serial port
  if (Serial.available() > 0) {
    // Read the incoming microphone value from the serial port
    int micValue = Serial.parseInt();

    // Ensure the micValue is within the expected range (0 to 1023)
    micValue = constrain(micValue, 0, 1023);

    // Map the micValue to RGB LED values
    int redValue = map(micValue, 0, 1023, 0, 255);
    int greenValue = map(micValue, 0, 1023, 255, 0); 
    int blueValue = map(micValue, 0, 1023, 128, 255); 

    // Write the values to the RGB LED
    analogWrite(redPin, redValue);
    analogWrite(greenPin, greenValue);
    analogWrite(bluePin, blueValue);

    // Small delay to stabilize the color change
    delay(100);
  }
}
