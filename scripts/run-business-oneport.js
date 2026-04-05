#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

const GATEWAY_PORT = Number(process.env.BUSINESS_GATEWAY_PORT || 3000);
const SKIP_DOCKER = process.env.BUSINESS_SKIP_DOCKER === '1';
const MRP_PORT = 3005;

const APPS = {
  accounting: 'http://127.0.0.1:3007',
  ecommerce: 'http://127.0.0.1:3008',
  mrp: 'http://127.0.0.1:3005',
};

const BUSINESS_WORKSPACES = ['erp-accounting', 'erp-ecommerce', 'vierp-mrp'];

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

function runSyncStatus(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
}

function isDockerPermissionError(output) {
  const text = (output || '').toLowerCase();
  return (
    text.includes('permission denied while trying to connect to the docker api') ||
    text.includes('/var/run/docker.sock') ||
    text.includes('got permission denied')
  );
}

function ensureDockerInfrastructure() {
  const probe = spawnSync('docker', ['ps'], {
    stdio: 'pipe',
    shell: process.platform === 'win32',
    env: process.env,
    encoding: 'utf8',
  });

  if (probe.status === 0) {
    const up = runSyncStatus('npm', ['run', 'docker:up']);
    if (up.status === 0) return;

    console.log('docker:up failed. Retrying with sudo docker compose up -d...');
    runSync('sudo', ['-v'], 'sudo -v');
    runSync('sudo', ['docker', 'compose', 'up', '-d'], 'sudo docker compose up -d');
    return;
  }

  const combined = `${probe.stdout || ''}\n${probe.stderr || ''}`;
  if (isDockerPermissionError(combined)) {
    console.log('Docker socket permission denied. Retrying with sudo: docker compose up -d');
    console.log('You may be prompted for your sudo password.');

    const sudoCheck = spawnSync('sudo', ['-v'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });

    if (sudoCheck.status !== 0) {
      throw new Error(
        [
          'Failed to authenticate sudo for Docker startup.',
          'Fix on Ubuntu:',
          '  sudo usermod -aG docker $USER',
          '  newgrp docker',
          'Then rerun: npm run dev:business:one',
        ].join('\n')
      );
    }

    runSync('sudo', ['docker', 'compose', 'up', '-d'], 'sudo docker compose up -d');
    return;
  }

  throw new Error('Docker is not ready. Please ensure Docker Engine is installed and running.');
}

function buildBusinessEnv() {
  const env = { ...process.env };

  // Provide sane local defaults so NextAuth does not crash MRP APIs.
  if (!env.NEXTAUTH_SECRET) {
    env.NEXTAUTH_SECRET = 'dev-business-oneport-nextauth-secret';
    console.log('Using default NEXTAUTH_SECRET for local business profile.');
  }

  if (!env.NEXTAUTH_URL) {
    env.NEXTAUTH_URL = `http://localhost:${MRP_PORT}`;
    console.log(`Using default NEXTAUTH_URL=${env.NEXTAUTH_URL}`);
  }

  // Newer Auth.js setups may read AUTH_SECRET/AUTH_URL aliases.
  if (!env.AUTH_SECRET) {
    env.AUTH_SECRET = env.NEXTAUTH_SECRET;
  }
  if (!env.AUTH_URL) {
    env.AUTH_URL = env.NEXTAUTH_URL;
  }

  return env;
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

  if (SKIP_DOCKER) {
    console.log('1) Skipping Docker infrastructure (BUSINESS_SKIP_DOCKER=1).');
  } else {
    console.log('1) Starting Docker infrastructure...');
    ensureDockerInfrastructure();
  }

  console.log('2) Preparing database schemas and seed data...');
  runSync('node', ['scripts/db-push-business.js'], 'db-push-business');

  console.log('2.1) Generating Prisma clients for business modules...');
  for (const workspace of BUSINESS_WORKSPACES) {
    runSync('npm', ['run', 'db:generate', '--workspace', workspace], `${workspace} db:generate`);
  }

  console.log('3) Starting business gateway at one localhost...');
  createGateway();

  console.log('4) Starting business modules (Accounting, Ecommerce, MRP)...\n');

  const businessEnv = buildBusinessEnv();

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
      env: businessEnv,
    }
  );

  dev.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} catch (error) {
  console.error(String(error));
  process.exit(1);
}
