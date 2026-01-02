// Example configuration file for env-strict CLI
// Copy this to env-strict.config.js and customize for your project

module.exports = {
  // Required variables
  PORT: 'number',
  DATABASE_URL: 'url',
  API_KEY: 'string',

  // Optional variables (using ? suffix)
  DEBUG: 'boolean?',
  LOG_LEVEL: 'string?',

  // Variables with defaults
  APP_NAME: { type: 'string', default: 'my-app' },
  MAX_CONNECTIONS: { type: 'number', default: 10 },

  // Object syntax for more control
  NODE_ENV: { type: 'string', required: true },
  CACHE_ENABLED: { type: 'boolean', required: false }
};
