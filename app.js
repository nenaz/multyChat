const fs = require('fs');
const path = require('path')
const http = require('http');
const https = require('https');
const express = require('express')
const urlencoded = require("body-parser")
const json = require("body-parser")
const app = express();
const url = require('url');
const certOptions = {
  key: fs.readFileSync(path.resolve('certs/ca.key')),
  cert: fs.readFileSync(path.resolve('certs/ca.crt'))
}
const cors = require('cors')

const CLIENT_ORIGIN = [
  'https://127.0.0.1:3000',
  'https://localhost:3000',
  'https://localhost:8080',
  'https://127.0.0.1:8080',
  'http://localhost:3000',
  'http://localhost:3001',
]

app.use(urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin");
  next();
});
app.use(json());
app.use(express.json())

app.use(cors({
  origin: CLIENT_ORIGIN
})) 

app.get('/', (request, response) => {
  console.log(`URL: ${request.url}`);
  response.send('Hello, Server!');
});

app.post('/', (request, response) => {
  console.log(`URL: ${request.url}`);
  response.send('Hello, Server!');
});

app.get('/vkontakte/callback', (req, res) => {
  console.log('URL----------req:', req);
  console.log('URL----------res:', res);
  const urlFormat = url.format({
      protocol: req.protocol,
      host: req.get('host')
  });
  console.log('urlFormat', urlFormat)
  // const url = `https://oauth.vk.com/authorize
  //   ?client_id=${client_id}
  //   &display=popup
  //   &redirect_uri=https://oauth.vk.com/blank.html
  //   &scope=wall,friends
  //   &response_type=token
  //   &v=5.52
  // `;
  res.send(req.query);
})

app.post('/vkontakte-get', (req, res) => {
  console.log(`URL: ${req.url}`);
  res.send('Hello, Server!');
  const client_id = 7022338;
  const url = `https://oauth.vk.com/authorize
    ?client_id=${client_id}
    &display=popup
    &redirect_uri=https://oauth.vk.com/blank.html
    &scope=wall,friends
    &response_type=token
    &v=5.52
  `;
  const request = https.get(url, (response) => {
    response.setEncoding('utf8');
    response.on('data', (d) => {
      console.log('---dd--', d);
      res.end(d);
    });
  });
  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
  // https://oauth.vk.com/authorize?client_id=***APP_ID***&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=wall,friends&response_type=token&v=5.52
});

// const server = https.createServer(certOptions, app)
const server = app.listen(process.env.PORT || 8080, (error) => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`Server listening on port ${server.address().port}`);
});

// server.listen(process.env.PORT || 8080, () => {
//   console.log('listening...')
// })