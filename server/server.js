const express = require('express');
const crypto = require('crypto');
const app = express()

const sessions = {};

// Opens a new mood light session and provides a unique id string for future requests.
app.post('/new', (req, res) => {
  const id = crypto.randomUUID();
  sessions[id] = {};

  res.status(201).json({id});
});

// get sentiment analysis
app.post('/sentiment', (req, res) => {
  console.log(req.body);
});

