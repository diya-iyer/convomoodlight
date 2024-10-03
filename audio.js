const fs = require("fs");
const { SpeechRecorder } = require("speech-recorder");
const wavefile = require("wavefile");
const axios = require('axios');
const FormData = require('form-data');  // Import form-data

const { WaveFile } = wavefile;

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

    // Save the audio file to disk
    const filePath = 'recorded_audio.wav';
    fs.writeFileSync(filePath, wav.toBuffer());

    // Create form-data to send the file
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
      // Send the file to the server
      const response = await axios.post('http://localhost:3000/sentiment', formData, {
        headers: {
          ...formData.getHeaders()  // Set the appropriate headers
        }
      });
      console.log('File sent successfully:', response.data);
      resolve(response.data);
    } catch (error) {
      console.error('Error sending file:', error);
      reject(error);
    }
  }, duration);
});

// Example usage
const main = async () => {
  try {
    console.log("Recording for 5 seconds...");
    const result = await recordAudio(5000);
    console.log("Recording finished.");
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
