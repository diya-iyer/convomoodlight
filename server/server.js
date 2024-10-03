const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });  // Directory where files will be temporarily stored
const sessions = {};

// Opens a new mood light session and provides a unique id string for future requests.
app.post('/new', (req, res) => {
  const id = crypto.randomUUID();
  sessions[id] = {};

  return res.status(201).json({ id });
});

// Closes a mood light session.
app.post('/end', (req, res) => {
  const { id } = req.query;
  console.log(id, req.query);

  if (!id) return res.status(400).json({ error: "Expected a session id. None was given." });
  if (!sessions[id]) return res.status(404).json({ error: "No session found with that id." });

  delete sessions[id];
  return res.status(204).json({});
});

// Endpoint to receive the audio file and handle sentiment analysis
app.post('/sentiment', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Received file:', file);

  // At this point, the file is stored in the 'uploads/' folder, and you can process it.
  // You could pass it to a sentiment analysis model or perform other processing.

  // Clean up the file after processing if necessary
  fs.unlinkSync(file.path);

  res.json({ message: 'File received and processed' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
