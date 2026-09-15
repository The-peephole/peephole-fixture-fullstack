import express from 'express';

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

app.listen(port, host, () => {
  console.log(`peephole-fixture-backend listening on ${host}:${port}`);
});
