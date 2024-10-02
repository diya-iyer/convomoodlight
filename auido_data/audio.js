const fs = require("fs");
const { SpeechRecorder } = require("speech-recorder");
const wavefile = require("wavefile");
const tmp = require('tmp');
const { SerialPort } = require('serialport');

const { WaveFile } = wavefile;

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600});

const createTempFile = (postfix) => new Promise((resolve, reject) => {
  tmp.file(
    { postfix: postfix.indexOf('.') === 0 ? postfix : `.${postfix}` }, 
    (err, path) => err ? reject(err) : resolve(path)
  );
});

// Function to calculate the average amplitude from the audio buffer
const calculateAverageAmplitude = (buffer) => {
  const total = buffer.reduce((sum, sample) => sum + Math.abs(sample), 0);
  return total / buffer.length;
};

const recordAudio = (duration = 5000) => new Promise((resolve, reject) => {
  const buffer = [];
  const sampleRate = 16000;

  const recorder = new SpeechRecorder({
    onAudio: ({ audio }) => {
      buffer.push(...audio);
    },
    onError: (error) => {
      reject(error);
    }
  });

  recorder.start();

  setTimeout(async () => {
    recorder.stop();
    const wav = new WaveFile();
    wav.fromScratch(1, sampleRate, "16", buffer);
    
    // const tempFile = await createTempFile('wav');
    // just make a file in this folder called recorded_audio.wav
    fs.writeFileSync('recorded_audio.wav', wav.toBuffer());
    // fs.writeFileSync(tempFile, wav.toBuffer());

    // Calculate the average amplitude
    const avgAmplitude = calculateAverageAmplitude(buffer);
    resolve(avgAmplitude);

    //resolve('recorded_audio.wav');
  }, duration);
});

// Send value to Arduino
const sendMicValueToArduino = (micValue) => {
  // Map the value to fit within 0-1023 (Arduino's analog range)
  const mappedValue = Math.min(1023, Math.max(0, Math.floor(micValue * 1023)));
  port.write(`${mappedValue}\n`); // Send as a string followed by a newline
};

// Example usage
const main = async () => {
  try {
    console.log("Recording for 5 seconds...");
    const avgAmplitude = await recordAudio(5000);
   // const audioFile = await recordAudio(5000);

    console.log("Recording finished.");

    // Send the micValue to Arduino
    sendMicValueToArduino(avgAmplitude);
    console.log("Data sent to Arduino.");

  } catch (error) {
    console.error("Error:", error);
  }
};

main();