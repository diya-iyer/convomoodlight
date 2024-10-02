const client = {
  apiKey: 'b022c0038afd47618c3547adaa1109f8',
  async transcribe(params: any) {
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: this.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const transcript = await response.json();
    return transcript;
  },
};

const transcribeAndAnalyzeSentiment = async (sessionId: string) => {
  try {
    const audioUrl = `http://localhost:3000/audio?id=${sessionId}`;

    const params = {
      audio_url: audioUrl, 
      sentiment_analysis: true,
    };

    const transcript = await client.transcribe(params);

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
