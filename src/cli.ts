#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

function showHelp() {
  console.log(`
env-strict v0.1.0

Usage:
  env-strict check [options]

Commands:
  check       Validate environment variables against schema

Options:
  --help      Show this help message

Example:
  Create a env-strict.config.js file in your project root:

  module.exports = {
    PORT: "number",
    DATABASE_URL: "url",
    DEBUG: "boolean?",
    APP_NAME: { type: "string", default: "my-app" }
  };

  Then run:
  npx env-strict check
`);
}

async function checkCommand() {
  const configPath = path.join(process.cwd(), 'env-strict.config.js');

  if (!fs.existsSync(configPath)) {
    console.error('❌ Error: env-strict.config.js not found in current directory');
    console.error('\nCreate a config file first. Example:');
    console.error(`
module.exports = {
  PORT: "number",
  DATABASE_URL: "url",
  DEBUG: "boolean?"
};
`);
    process.exit(1);
  }

  try {
    const schema = require(configPath);
    const { env } = require('./index');

    env(schema);
    console.log('✅ All environment variables are valid!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Environment validation failed:\n');
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err: string) => {
        console.error(`  • ${err}`);
      });
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === 'check') {
  checkCommand();
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Run "env-strict --help" for usage information');
  process.exit(1);
}
