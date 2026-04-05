#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

const GATEWAY_PORT = Number(process.env.BUSINESS_GATEWAY_PORT || 3000);

const APPS = {
  accounting: 'http://127.0.0.1:3007',
  ecommerce: 'http://127.0.0.1:3008',
  mrp: 'http://127.0.0.1:3005',
};

function runSync(command, args, label) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`Failed: ${label}`);
  }
}

function parseCookie(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, item) => {
    const [k, ...v] = item.trim().split('=');
    acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {});
}

function servePortal(res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>VietERP Business Gateway</title>
  <style>
    body{font-family:Segoe UI,Arial,sans-serif;background:#f4f6fb;padding:28px;color:#111827}
    .card{max-width:900px;background:#fff;padding:24px;border:1px solid #d1d5db;border-radius:14px}
    h1{margin:0 0 10px;font-size:28px}
    p{color:#374151}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px}
    a{display:block;padding:14px;border:1px solid #cbd5e1;border-radius:10px;text-decoration:none;color:#0f172a;font-weight:700;background:#f8fafc}
    a small{display:block;color:#475569;font-weight:500;margin-top:4px}
  </style>
</head>
<body>
  <div class="card">
    <h1>Business Portal (1 localhost)</h1>
    <p>Mo mot URL duy nhat, cac module kinh doanh chay qua gateway.</p>
    <div class="grid">
      <a href="/accounting">Accounting<small>/accounting</small></a>
      <a href="/ecommerce">Ecommerce<small>/ecommerce</small></a>
      <a href="/mrp">MRP<small>/mrp</small></a>
    </div>
  </div>
</body>
</html>`);
}

function createGateway() {
  const proxy = httpProxy.createProxyServer({
    ws: true,
    changeOrigin: true,
    xfwd: true,
    secure: false,
  });

  proxy.on('error', (err, req, res) => {
    if (res && !res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    if (res) {
      res.end(`Gateway error: ${err.message}`);
    }
  });

  const server = http.createServer((req, res) => {
    const url = req.url || '/';

    if (url === '/' || url === '/index.html') {
      servePortal(res);
      return;
    }

    const cookies = parseCookie(req.headers.cookie);

    const routeWithPrefix = (prefix, appKey) => {
      if (!url.startsWith(prefix)) return false;

      const stripped = url.slice(prefix.length) || '/';
      req.url = stripped.startsWith('/') ? stripped : `/${stripped}`;
      res.setHeader('Set-Cookie', `business_app=${appKey}; Path=/; HttpOnly; SameSite=Lax`);
      proxy.web(req, res, { target: APPS[appKey] });
      return true;
    };

    if (routeWithPrefix('/accounting', 'accounting')) return;
    if (routeWithPrefix('/ecommerce', 'ecommerce')) return;
    if (routeWithPrefix('/mrp', 'mrp')) return;

    const fallbackApp = cookies.business_app || 'accounting';
    proxy.web(req, res, { target: APPS[fallbackApp] || APPS.accounting });
  });

  server.on('upgrade', (req, socket, head) => {
    const cookies = parseCookie(req.headers.cookie);
    const app = cookies.business_app || 'accounting';
    proxy.ws(req, socket, head, { target: APPS[app] || APPS.accounting });
  });

  server.listen(GATEWAY_PORT, () => {
    console.log(`Gateway ready at http://localhost:${GATEWAY_PORT}`);
    console.log('Routes: /accounting | /ecommerce | /mrp');
  });

  return server;
}

try {
  console.log('\n=== Business Profile (One Localhost) ===\n');

  console.log('1) Starting Docker infrastructure...');
  runSync('npm', ['run', 'docker:up'], 'docker:up');

  console.log('2) Preparing database schemas and seed data...');
  runSync('node', ['scripts/db-push-business.js'], 'db-push-business');

  console.log('3) Starting business gateway at one localhost...');
  createGateway();

  console.log('4) Starting business modules (Accounting, Ecommerce, MRP)...\n');

  const dev = spawn(
    'npx',
    [
      'turbo',
      'run',
      'dev',
      '--concurrency=8',
      '--filter=erp-accounting',
      '--filter=erp-ecommerce',
      '--filter=vierp-mrp',
    ],
    {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    }
  );

  dev.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} catch (error) {
  console.error(String(error));
  process.exit(1);
}
