# Conversation Mood Light

Conversation Mood Light tunes its color to make your conversations more immersive and engaging. The mood light uses AI sentiment analysis to adapt to the tone of your voice, keeping your conversations the center of focus.

## Getting Started
### Prerequisites
- [Arduino IDE](https://www.arduino.cc/en/software)
- [Processing](https://processing.org/download)

### Installation
Clone the repo: 
```bash
git clone https://github.com/diya-iyer/mood-light.git
```

### Build the Circuit
Build the circuit as specified in [the schematic](/circuit_design.ckt).

## Usage
### Start the Mood Light
In Arduino IDE, run the [Arduino sketch](/auido_data/arduino_audio_data.ino). Then in Processing, run the [Processing sketch](/processing_http_request/processing_http_request.pde).

## Host the server locally
Install the dependencies:
```bash
npm install
```

Put your Assembly AI API key in the config file.

Start the server
```bash
npm start
```

Replace the server url in [the Processing file](/processing_http_request/processing_http_request.pde) with your local server url.

Start the Arduino and Processing sketches normally.

## Documentation
