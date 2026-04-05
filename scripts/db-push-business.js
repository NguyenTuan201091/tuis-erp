#!/usr/bin/env node

const { spawnSync } = require('child_process');

const BASE_DATABASE_URL = process.env.BASE_DATABASE_URL || 'postgresql://erp:erp_dev_2026@localhost:5432/erp_dev';

const jobs = [
  { workspace: 'erp-accounting', schema: 'accounting' },
  { workspace: 'erp-ecommerce', schema: 'ecommerce' },
  { workspace: 'vierp-mrp', schema: 'mrp' },
];

function buildDatabaseUrl(baseUrl, schema) {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}schema=${schema}`;
}

function run(command, args, env, label) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });

  if (result.status !== 0) {
    throw new Error(`Failed: ${label}`);
  }
}

try {
  console.log('\n=== Business DB Push ===\n');

  for (const job of jobs) {
    const databaseUrl = buildDatabaseUrl(BASE_DATABASE_URL, job.schema);
    const env = {
      ...process.env,
      DATABASE_URL: databaseUrl,
    };

    console.log(`>> ${job.workspace} (schema=${job.schema})`);
    run('npm', ['run', 'db:push', '--workspace', job.workspace], env, `${job.workspace} db:push`);
  }

  const accountingEnv = {
    ...process.env,
    DATABASE_URL: buildDatabaseUrl(BASE_DATABASE_URL, 'accounting'),
  };

  console.log('>> erp-accounting seed');
  run('npm', ['run', 'db:seed', '--workspace', 'erp-accounting'], accountingEnv, 'erp-accounting db:seed');

  console.log('\nBusiness DB is ready.\n');
} catch (error) {
  console.error(String(error));
  process.exit(1);
}
