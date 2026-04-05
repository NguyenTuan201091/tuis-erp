#!/usr/bin/env node

/**
 * Full database push for the monorepo with isolated schemas.
 *
 * Usage:
 *   npm run db:push:full
 *   npm run db:push:full -- --seed-accounting
 */

const { spawnSync } = require('child_process');

const BASE_DATABASE_URL = process.env.BASE_DATABASE_URL || 'postgresql://erp:erp_dev_2026@localhost:5432/erp_dev';

const jobs = [
  { workspace: 'erp-accounting', schema: 'accounting' },
  { workspace: 'erp-ecommerce', schema: 'ecommerce' },
  { workspace: 'vierp-hrm', schema: 'hrm' },
  { workspace: 'vierp-hrm-ai', schema: 'hrm_ai' },
  { workspace: 'erp-hrm', schema: 'hrm_unified' },
  { workspace: 'vierp-mrp', schema: 'mrp' },
  { workspace: '@vierp/tpm-api', schema: 'tpm_api' },
  { workspace: '@vierp/database', schema: 'platform_db' },
];

const runSeed = process.argv.includes('--seed-accounting');
const failures = [];

function buildDatabaseUrl(baseUrl, schema) {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}schema=${schema}`;
}

function runCommand(command, args, env) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });

  return result.status === 0;
}

console.log('\n=== Full db:push (isolated schemas) ===\n');
console.log(`Base database URL: ${BASE_DATABASE_URL}`);
console.log('Workspaces:');
for (const job of jobs) {
  console.log(`- ${job.workspace} -> schema=${job.schema}`);
}
console.log('');

for (const job of jobs) {
  const databaseUrl = buildDatabaseUrl(BASE_DATABASE_URL, job.schema);
  const env = { ...process.env, DATABASE_URL: databaseUrl };

  console.log(`\n>> Running db:push for ${job.workspace} (schema=${job.schema})`);
  const ok = runCommand('npm', ['run', 'db:push', '--workspace', job.workspace], env);

  if (!ok) {
    failures.push({ workspace: job.workspace, schema: job.schema });
  }
}

if (runSeed) {
  const accountingUrl = buildDatabaseUrl(BASE_DATABASE_URL, 'accounting');
  const env = { ...process.env, DATABASE_URL: accountingUrl };

  console.log('\n>> Running db:seed for erp-accounting (schema=accounting)');
  const ok = runCommand('npm', ['run', 'db:seed', '--workspace', 'erp-accounting'], env);

  if (!ok) {
    failures.push({ workspace: 'erp-accounting (seed)', schema: 'accounting' });
  }
}

console.log('\n=== Result ===');
if (failures.length === 0) {
  console.log('All db:push tasks completed successfully.');
  process.exit(0);
}

console.error('Some tasks failed:');
for (const failure of failures) {
  console.error(`- ${failure.workspace} (schema=${failure.schema})`);
}
process.exit(1);
