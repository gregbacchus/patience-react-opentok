import envalid = require('envalid');
import { port, str } from 'envalid';

// make sure all required env vars are present
export const env = envalid.cleanEnv(process.env, {
  API_KEY: str({ desc: 'OpenTok API Key' }),
  API_SECRET: str({ desc: 'OpenTok API Secret' }),
  PORT: port({ default: 5000, desc: 'HTTP port to bind' }),
  REACT_PORT: port({ default: 3000, desc: 'REACT HTTP port for proxy (dev only)' }),
});
