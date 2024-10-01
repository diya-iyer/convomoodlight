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
      const results = transcript.sentiment_analysis_results.map((result: any) => ({
        text: result.text,
        sentiment: result.sentiment,
        confidence: result.confidence,
      }));

      return {
        transcription: transcript.text, // The full transcription text
        sentimentResults: results, // Array of sentiment analysis results with text, sentiment, and confidence
      };
    } else {
      return {
        transcription: transcript.text,
        sentimentResults: [], // Empty array if no sentiment analysis results
      };
    }
  } catch (error) {
    console.error('Error in transcription:', error);
    throw error; 
  }
};

export default transcribeAndAnalyzeSentiment;

