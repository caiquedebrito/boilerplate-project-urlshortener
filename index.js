require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const urls = new Map();

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  let hostname;

  try {
    const parsedUrl = new URL(url);
    hostname = parsedUrl.hostname;
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = Math.floor(Math.random() * 1000000);

    urls.set(shortUrl, url);

    res.json({ original_url: url, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  const shortUrl = req.params.shorturl;
  const originalUrl = urls.get(Number(shortUrl));
  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
