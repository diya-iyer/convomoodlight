import { AssemblyAI } from 'assemblyai';
import fs from 'fs';

const client = new AssemblyAI({
  apiKey: 'b022c0038afd47618c3547adaa1109f8',
});

const transcribeAndAnalyzeSentiment = async (audioFilePath: string) => {
  const audioData = fs.readFileSync(audioFilePath);
  
  const params = {
    audio: audioData.toString('base64'), // Converting the audio file to base64 string
    sentiment_analysis: true,
  };

  try {
    const transcript = await client.transcripts.transcribe(params);
    if (transcript.sentiment_analysis_results) {
      for (const result of transcript.sentiment_analysis_results) {
        console.log(result.text);
        console.log(result.sentiment);
        console.log(result.confidence);
      }
    } else {
      console.log('No sentiment analysis results found.');
    }
  } catch (error) {
    console.error('Error in transcription:', error);
  }
};

export default transcribeAndAnalyzeSentiment;
