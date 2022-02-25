// file: src/app.js

const express = require('express');
const app = express();
const port = (process.env.PORT) ? process.env.PORT : 3001;

// use built-in middleware to parse JSON payloads
app.use(express.json());

// serve static files from the public direcotry
app.use('/', express.static('public'));

//=============================================================================
// set API endpoints
//=============================================================================

// hello message
const hello = require('./api/hello');
app.get('/hello', hello);

// execute user-entered add function
const add = require('./api/add');
app.post('/add', add);

//=============================================================================
// bind and listen for connections on port
//=============================================================================

app.listen(port, () => {
  console.log(`AlgoSim backend listening on port ${port}`);
});

//
// end of file: src/app.js
