const fs = require("fs");
const OpenAI = require("openai");
const { SpeechRecorder } = require("speech-recorder");
const wavefile = require("wavefile");
const tmp = require('tmp');
require('dotenv').config();

const { WaveFile } = wavefile;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

const transcribeAudio = async (filePath) => {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
    language: 'en',
    response_format: 'verbose_json',
  });

  return transcription.text;
};

// Example usage
const main = async () => {
  try {
    console.log("Recording for 5 seconds...");
    const audioFile = await recordAudio(5000);
    console.log("Recording finished. Transcribing...");
    const transcription = await transcribeAudio(audioFile);
    console.log("Transcription:", transcription);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();