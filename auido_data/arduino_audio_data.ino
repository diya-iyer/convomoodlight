const int redPin = 4;
const int greenPin = 3;
const int bluePin = 2;
const int micPin = A0;

void setup() {
  // Initialize the RGB LED pins as outputs
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // Initialize the microphone pin as input
  pinMode(micPin, INPUT);

  // Start serial communication for debugging
  Serial.begin(9600);
}

void loop() {
  // Read the microphone sensor value
  int micValue = analogRead(micPin);

  // Print the microphone value to the serial monitor
  Serial.println(micValue);

  // Map the microphone value to an RGB LED color range
  // Assume micValue ranges from 0 to 1023 and we map it to RGB values from 0 to 255
  int redValue = map(micValue, 0, 1023, 0, 255);
  int greenValue = map(micValue, 0, 1023, 255, 0); // Reverse for variety
  int blueValue = map(micValue, 0, 1023, 128, 255); // Another variation

  // Set the RGB LED colors based on micValue
  analogWrite(redPin, redValue);
  analogWrite(greenPin, greenValue);
  analogWrite(bluePin, blueValue);

  // Small delay to stabilize the readings
  delay(100);
}