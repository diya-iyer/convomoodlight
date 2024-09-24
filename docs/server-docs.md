# Server Docs

## Starting the Mood Light
#### `POST /new`
Opens a new mood light session and provides a unique id string for future requests.

### HTTP Status Codes
Status Code|Description
-|-
201|New session successfully created

### Example Response (201)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
}
```

## Closing the Mood Light
#### `POST /end`
Closes a mood light session.

### HTTP Status Codes
Status Code|Description
-|-
204|Session successfully ended
400|Missing or malformed id
404|Could not find session with corresponding id

### Query Parameters
#### `id` (string)
Unique UUID corresponding to the open session.

## Uploading Mic Data
#### `POST /audio`
Uploads microphone data for sentiment analysis. Redirects to [sentiment](#retrieve-sentiment-result) if an analysis is ready.

### Query Parameters
#### `id` (string)
Unique UUID corresponding to the open session.

### Body Parameters
#### `data` (audio/mpeg)
The raw microphone data to be uploaded

### HTTP Status Codes
Status Code|Description
-|-
204|Data successfully uploaded
303|Sentiment result ready
400|Missing or malformed id
404|Could not find session with corresponding id

## Accessing Audio Data
#### `GET /audio`
Retrieves the audio file.

### Query Parameters
#### `id` (string)
Unique UUID corresponding to the desired session.

### HTTP Status Codes
Status Code|Description
-|-
200|Successfully retrieved the requested file
400|Missing or malformed id
404|Could not find session with corresponding id

## Retrieve sentiment result
#### `GET /sentiment`
Retrieves the last sentiment analysis result.

### Query Parameters
#### `id` (string)
Unique UUID corresponding to the desired session.

### HTTP Status Codes
Status Code|Description
-|-
200|Successfully retrieved the sentiment
400|Missing or malformed id
404|Could not find session with corresponding id

### Example Response (200)
```json
{
  "result": {
    sentiment: "NEGATIVE",
    confidence: 0.8181034922599792,
  },
}
```