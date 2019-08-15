import * as OpenTok from 'opentok';
import { env } from './env';
import * as express from 'express';
import * as path from 'path';

const app = express();

// Starts the express app
function init() {
  app.listen(env.PORT, function () {
    console.log(`Your app is now ready at http://localhost:${env.PORT}/`);
  });
}

// Initialize OpenTok
const opentok = new OpenTok(env.API_KEY, env.API_SECRET);

// Create a session and store it in the express app
opentok.createSession({}, (err, session) => {
  if (err) throw err;
  if (!session) throw new Error('Unable to create session');

  app.set('sessionId', session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get('/session', (_req, res) => {
  const sessionId = app.get('sessionId');
  // generate a fresh token for this client
  const token = opentok.generateToken(sessionId, {});

  res.send({
    apiKey: env.API_KEY,
    sessionId: sessionId,
    token: token,
  });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  const proxy = require('express-http-proxy');
  app.use('/', proxy(`http://localhost:${env.REACT_PORT}`));
}
