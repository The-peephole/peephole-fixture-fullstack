import express from 'express';
import { createHash } from 'node:crypto';

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    service: 'peephole-fixture-backend',
  });
});

app.get('/api/hello', (request, response) => {
  response.json({
    message: 'Hello from Peephole backend',
  });
});

// M10 generated-secret fixture: exposes only a non-reversible digest of the
// value Peephole injected, never the raw value itself.
app.get('/api/secret-check', (request, response) => {
  const value = process.env.SESSION_SECRET;
  if (typeof value !== 'string' || value.length === 0) {
    response.json({ configured: false });
    return;
  }
  const sha256 = createHash('sha256').update(value, 'utf8').digest('hex');
  response.json({ configured: true, sha256 });
});

// Deliberate, hostile-by-design stdout leak: verifies Peephole's production
// log pipeline never forwards a sandboxed backend's stdout into its own
// systemd journal. Only fires when a generated secret was actually injected.
const sessionSecret = process.env.SESSION_SECRET;
if (typeof sessionSecret === 'string' && sessionSecret.length > 0) {
  console.log('PEEPHOLE_M10_SECRET_LOG_PROBE:' + sessionSecret);
}

app.listen(port, host, () => {
  console.log(`peephole-fixture-backend listening on ${host}:${port}`);
});
