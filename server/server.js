const express = require('express');
const crypto = require('crypto');
const app = express()
const port = 3000

const sessions = {};

// Opens a new mood light session and provides a unique id string for future requests.
app.post('/new', (req, res) => {
  const id = crypto.randomUUID();
  sessions[id] = {};

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

// get sentiment analysis
app.post('/sentiment', (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})