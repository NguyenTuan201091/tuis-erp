#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');

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

try {
  console.log('\n=== Business Profile Boot ===\n');

  console.log('1) Starting Docker infrastructure...');
  runSync('npm', ['run', 'docker:up'], 'docker:up');

  console.log('2) Preparing database schemas and seed data...');
  runSync('node', ['scripts/db-push-business.js'], 'db-push-business');

  console.log('3) Starting business modules (Accounting, Ecommerce, MRP)...\n');

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
