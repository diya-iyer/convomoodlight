const assemblyAI = require('./../api/apiclient');

// sends the audio to the AI for analysis
const doSentimentAnalysis = async (session, url) => {
  const sentiment = await assemblyAI.analyze(url);
  session.sentiment = sentiment;
  session.sentimentReady = true;
};

module.exports(doSentimentAnalysis);