const fs = require("fs");
const { SpeechRecorder } = require("speech-recorder");
const wavefile = require("wavefile");
const tmp = require('tmp');

const { WaveFile } = wavefile;

const createTempFile = (postfix) => new Promise((resolve, reject) => {
  tmp.file(
    { postfix: postfix.indexOf('.') === 0 ? postfix : `.${postfix}` }, 
    (err, path) => err ? reject(err) : resolve(path)
  );
});

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
    resolve('recorded_audio.wav');
  }, duration);
});

// Example usage
const main = async () => {
  try {
    console.log("Recording for 5 seconds...");
    const audioFile = await recordAudio(5000);
    console.log("Recording finished.");
  } catch (error) {
    console.error("Error:", error);
  }
};

main();