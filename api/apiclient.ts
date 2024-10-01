import { AssemblyAI } from 'assemblyai';
import fs from 'fs';

const client = new AssemblyAI({
  apiKey: 'b022c0038afd47618c3547adaa1109f8',
});

const transcribeAndAnalyzeSentiment = async (audioFilePath: string, sessionId: string) => {
  const audioData = fs.readFileSync(audioFilePath);

  const params = {
    audio: audioData.toString('base64'), // Converting the audio file to base64 string
    sentiment_analysis: true,
  };

  try {
    const transcript = await client.transcripts.transcribe(params);

    if (transcript.sentiment_analysis_results) {
      const sentimentData = transcript.sentiment_analysis_results.map(result => ({
        text: result.text,
        sentiment: result.sentiment,
        confidence: result.confidence,
      }));

      // Send sentiment analysis data to the server using fetch
      const response = await fetch('http://localhost:3000/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,  // Passing session id
          sentimentData, // Passing sentiment data to the server
        }),
      });

      if (response.ok) {
        console.log("Sentiment analysis sent to server.");
      } else {
        console.error("Failed to send sentiment analysis to server:", response.statusText);
      }
    } else {
      console.log("No sentiment analysis results found.");
    }
  } catch (error) {
    console.error("Error in transcription or sending to server:", error);
  }
};

export default transcribeAndAnalyzeSentiment;

