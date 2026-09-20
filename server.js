const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const HTML_FILE = path.join(__dirname, 'index.html');
const SCORES_FILE = path.join(__dirname, 'scores.json');

function readScores() {
  try { return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8')); }
  catch (_e) { return []; }
}

function writeScores(scores) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy' }));
    return;
  }

  if (req.method === 'GET' && (req.url === '/api/scores' || req.url === '/api/scores/')) {
    const scores = readScores().sort((a, b) => b.score - a.score).slice(0, 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(scores));
    return;
  }

  if (req.method === 'POST' && (req.url === '/api/scores' || req.url === '/api/scores/')) {
    try {
      const body = JSON.parse(await readBody(req));
      if (!body.name || typeof body.score !== 'number') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Thiếu name hoặc score' }));
        return;
      }
      const scores = readScores();
      scores.push({ name: String(body.name).slice(0, 20), score: body.score, level: body.level || 1, date: new Date().toISOString() });
      scores.sort((a, b) => b.score - a.score);
      writeScores(scores.slice(0, 100));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, rank: scores.findIndex(s => s.name === body.name && s.score === body.score) + 1 }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) { res.writeHead(500); res.end('Internal Server Error'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('Space Shooter server running on port ' + PORT);
});
