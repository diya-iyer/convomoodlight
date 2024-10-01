const express = require('express');
const bodyparser = require('body-parser');
const sentimentAnalysis = require('./sentiment');
const crypto = require('crypto');
const app = express();
const port = 3000;

const sessions = {};

// Opens a new mood light session and provides a unique id string for future requests.
app.post('/new', (req, res) => {
  const id = crypto.randomUUID();
  sessions[id] = {
    sentimentReady: false,
  };

  return res.status(201).json({id});
});

// Closes a mood light session.
app.post('/end', (req, res) => {
  const { id } = req.query;
  console.log(id, req.query);

  if (!id) return res.status(400).json({error: "Expected a session id. None was given."});
  if (!sessions[id]) return res.status(404).json({error: "No session found with that id."});
  
  delete sessions[id];
  return res.status(204).json({});
});

// get audio
app.post('/audio', bodyParser.raw({ type: 'audio/mpeg' }), (req, res) => {
  const { id } = req.query;
  console.log(id, req.query);

  const data = req.body;

  if (!id) return res.status(400).json({error: "Expected a session id. None was given."});
  if (!data) return res.status(400).json({error: "No audio data provided."});
  if (!sessions[id]) return res.status(404).json({error: "No session found with that id."});

  sessions[id].lastAudio = data;

  const url = `/audio?id=${id}`;
  sentimentAnalysis.doSentimentAnalysis(sessions[id], url);

  if (sessions[id].sentimentReady) {
    sessions[id].sentimentReady = false;
    res.set({'Location': `/sentiment?id=${id}`});
    return res.status(303).end();
  }
  
  return res.status(204).json({});
});

// retrieve audio data from a session
app.get('/audio', (req, res) => {
  const { id } = req.query;
  console.log(id, req.query);

  if (!id) return res.status(400).json({error: "Expected a session id. None was given."});
  if (!sessions[id]) return res.status(404).json({error: "No session found with that id."});

  res.set({'Content-Type': 'audio/mpeg'});
  return res.status(200).end(sessions[id].lastAudio);
});

// get sentiment analysis
app.post('/sentiment', (req, res) => {
  const { id } = req.query;
  console.log(id, req.query);

  if (!id) return res.status(400).json({error: "Expected a session id. None was given."});
  if (!sessions[id]) return res.status(404).json({error: "No session found with that id."});
  
  if (!sessions[id].sentiment) return res.status(202).json({message: "no sentiment available yet"});
  return res.status(200).json({result: sessions[id].sentiment});
});

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})