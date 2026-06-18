/**
 * Local dev server — static frontend + /api/grade + /api/results
 * No Vercel login required. Run: npm run dev
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = path.join(__dirname, '..');
const PORT = parseInt(process.env.PORT || '3000', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  fs.readFileSync(filePath, 'utf8').split(/\r?\n/).forEach(function (line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  });
}

loadEnvFile(path.join(ROOT, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));

// Local exam only: grading + results dashboard — no Redis / gradebook
['REDIS_URL', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN'].forEach(
  function (k) { delete process.env[k]; }
);

const gradeHandler = require(path.join(ROOT, 'api', 'grade'));
const resultsHandler = require(path.join(ROOT, 'api', 'results'));

function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () {
      const raw = Buffer.concat(chunks).toString();
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { resolve(raw); }
    });
    req.on('error', reject);
  });
}

function adaptRes(nodeRes) {
  let statusCode = 200;
  const res = {
    setHeader: function (k, v) {
      nodeRes.setHeader(k, v);
      return res;
    },
    status: function (code) {
      statusCode = code;
      return res;
    },
    json: function (data) {
      nodeRes.statusCode = statusCode;
      if (!nodeRes.getHeader('Content-Type')) {
        nodeRes.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      nodeRes.end(JSON.stringify(data));
      return res;
    },
    send: function (data) {
      nodeRes.statusCode = statusCode;
      nodeRes.end(data);
      return res;
    },
    end: function (data) {
      nodeRes.statusCode = statusCode;
      nodeRes.end(data);
      return res;
    }
  };
  return res;
}

function adaptReq(nodeReq, body, urlObj) {
  return {
    method: nodeReq.method,
    headers: nodeReq.headers,
    body: body,
    query: Object.fromEntries(urlObj.searchParams),
    socket: { remoteAddress: nodeReq.socket.remoteAddress }
  };
}

async function runApi(handler, nodeReq, nodeRes, urlObj) {
  const body = nodeReq.method === 'POST' ? await readBody(nodeReq) : {};
  const req = adaptReq(nodeReq, body, urlObj);
  const res = adaptRes(nodeRes);
  await handler(req, res);
}

function serveStatic(urlPath, nodeRes) {
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(ROOT)) {
    nodeRes.statusCode = 403;
    nodeRes.end('Forbidden');
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    nodeRes.statusCode = 404;
    nodeRes.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  nodeRes.statusCode = 200;
  nodeRes.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(nodeRes);
}

const server = http.createServer(async function (nodeReq, nodeRes) {
  const urlObj = new URL(nodeReq.url, 'http://' + (nodeReq.headers.host || 'localhost'));

  try {
    if (urlObj.pathname === '/api/grade') {
      return await runApi(gradeHandler, nodeReq, nodeRes, urlObj);
    }
    if (urlObj.pathname === '/api/results') {
      return await runApi(resultsHandler, nodeReq, nodeRes, urlObj);
    }
    const filePath = decodeURIComponent(urlObj.pathname);
    serveStatic(filePath, nodeRes);
  } catch (err) {
    console.error('Server error:', err);
    if (!nodeRes.headersSent) {
      nodeRes.statusCode = 500;
      nodeRes.setHeader('Content-Type', 'application/json');
      nodeRes.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
});

server.listen(PORT, function () {
  const keyPath = path.join(ROOT, 'api', 'data', 'answer-key.json');
  console.log('');
  console.log('  Local exam server running (no Redis)');
  console.log('  Open:  http://localhost:' + PORT + '/');
  if (!fs.existsSync(keyPath)) {
    console.log('');
    console.log('  WARNING: api/data/answer-key.json missing — run: py scripts/split_questions.py');
  }
  if (!fs.existsSync(path.join(ROOT, '.env.local'))) {
    console.log('');
    console.log('  TIP: copy .env.local.example to .env.local (exam code + settings)');
  }
  console.log('');
});
