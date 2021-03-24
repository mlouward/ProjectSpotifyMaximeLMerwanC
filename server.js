'use strict';

require('dotenv').config();
const spotify = require('./spotify.js');
const express = require('express');
const FBeamer = require('./fbeamer');
const config = require('./config');
const f = new FBeamer(config.FB);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

//Home page
app.get('/', (_, res) => res.send("Hello, World!"));

// facebook bot endpoint for registering hook
app.get('/fb', (req, res) => f.registerHook(req, res));

// facebook bot endpoint for handling post requests
app.post('/fb', (req, res) => {
  return f.incoming(req, res, async data => {
    try {
      // message = Connect: send spotify connect url
      if (data.content === 'Connect') {
        await f.txt(data.sender, "Hello, please login with your spotify account to continue:");
        await f.txt(data.sender, spotify.loginUrl);
      }
      else if (data.content === "Playlists") {
        await f.txt(data.sender, "Here are your 10 latest playlists:");
        await f.carrousel(data.sender, spotify.playlists);
      }
      else if (data.pb) {
        const urlPlaylistChosen = data.pb.payload;
        console.log(urlTracksRequest)
        // POST request to our Python server

      }
      //else
      //  await f.txt(data.sender, "I didn't understand");
    } catch (e) {
      console.log(e);
    }
  })
});

app.get("/spotify", (req, res) => {
  console.log(req.body)
  spotify.receivedAuthCode(req.query.code);
  res.status(200).send();
});

app.get("/me", (req, res) => {
  console.log(req);
});

app.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));