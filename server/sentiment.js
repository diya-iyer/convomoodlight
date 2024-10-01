const assemblyAI = require('./../api/apiclient.ts');

// sends the audio to the AI for analysis
const doSentimentAnalysis = async (session, url) => {
  const result = await assemblyAI.transcribeAndAnalyzeSentiment(url);
  if (!result.sentimentResults) return;
  
  session.sentiment = {
    sentiment: result.sentimentResults.sentiment,
    confidence: result.sentimentResults.confidence,
  };
  session.sentimentReady = true;
};

module.exports(doSentimentAnalysis);