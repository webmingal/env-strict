# env-strict Setup Guide

Complete guide to installing and using env-strict in your Node.js projects.

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Basic Usage](#basic-usage)
4. [Advanced Usage](#advanced-usage)
5. [CLI Usage](#cli-usage)
6. [Real-World Examples](#real-world-examples)
7. [TypeScript Support](#typescript-support)
8. [Troubleshooting](#troubleshooting)

---

## Installation

### Option 1: Install from Local Path (Development/Testing)

If you're testing the package locally before publishing:

```bash
# Navigate to your project
cd /path/to/your/project

# Install env-strict from local path
npm install /path/to/env-strict
# Example: npm install ../satyam_plugin/env-strict
```

### Option 2: Install from npm (After Publishing)

Once published to npm:

```bash
npm install env-strict
```

### Option 3: Install from GitHub (After Pushing)

```bash
npm install github:yourusername/env-strict
```

---

## Quick Start

### Step 1: Create a `.env` file in your project root

```bash
# .env
PORT=3000
DATABASE_URL=postgresql://localhost:5432/mydb
DEBUG=true
API_KEY=your-secret-key
```

### Step 2: Install dotenv (to load .env files)

```bash
npm install dotenv
```

### Step 3: Use env-strict in your code

```javascript
// index.js or app.js
require('dotenv').config(); // Load .env file first!

const { env } = require('env-strict');

// Define your schema
const ENV = env({
  PORT: 'number',
  DATABASE_URL: 'url',
  DEBUG: 'boolean',
  API_KEY: 'string'
});

// Now use your validated environment variables
console.log(ENV.PORT);         // 3000 (as number, not string!)
console.log(ENV.DATABASE_URL); // "postgresql://localhost:5432/mydb"
console.log(ENV.DEBUG);        // true (as boolean, not string!)
console.log(ENV.API_KEY);      // "your-secret-key"
```

### Step 4: Run your application

```bash
node index.js
```

**That's it!** If any environment variable is missing or invalid, you'll get a clear error message.

---

## Basic Usage

### Supported Types

env-strict supports 4 basic types:

| Type | Description | Example Value |
|------|-------------|---------------|
| `string` | Any text value | `"hello"`, `"app-name"` |
| `number` | Numeric values | `3000`, `42`, `3.14` |
| `boolean` | True/false values | `true`, `false`, `1`, `0` |
| `url` | Valid URLs | `https://api.com`, `postgresql://localhost/db` |

### Required Variables

By default, all variables are required:

```javascript
const ENV = env({
  API_KEY: 'string',    // Required string
  PORT: 'number',       // Required number
  DATABASE_URL: 'url'   // Required URL
});
```

If any variable is missing, env-strict will throw an error:
```
❌ Environment validation failed with 1 error(s)
  • Missing required environment variable: API_KEY
```

### Optional Variables

Add `?` to make a variable optional:

```javascript
const ENV = env({
  PORT: 'number',        // Required
  DEBUG: 'boolean?',     // Optional
  LOG_LEVEL: 'string?'   // Optional
});

// If DEBUG is not set:
console.log(ENV.DEBUG); // undefined
```

### Default Values

Provide default values using object syntax:

```javascript
const ENV = env({
  PORT: { type: 'number', default: 3000 },
  APP_NAME: { type: 'string', default: 'my-app' },
  DEBUG: { type: 'boolean', default: false }
});

// If PORT is not in .env, it will be 3000
console.log(ENV.PORT); // 3000
```

---

## Advanced Usage

### Mixed Schema (Combining All Features)

```javascript
const ENV = env({
  // Required variables
  DATABASE_URL: 'url',
  API_KEY: 'string',

  // Optional variables
  DEBUG: 'boolean?',
  CACHE_TTL: 'number?',

  // Variables with defaults
  PORT: { type: 'number', default: 3000 },
  APP_NAME: { type: 'string', default: 'my-app' },
  MAX_CONNECTIONS: { type: 'number', default: 10 },

  // Object syntax for optional
  LOG_LEVEL: { type: 'string', required: false }
});
```

### Error Handling

```javascript
const { env, ValidationError } = require('env-strict');

try {
  const ENV = env({
    PORT: 'number',
    API_KEY: 'string'
  });

  // Your app code here
  console.log('✅ Environment validated successfully');

} catch (error) {
  if (error instanceof ValidationError) {
    console.error('❌ Environment validation failed:');
    console.error(error.message);

    // Print each error
    error.errors.forEach(err => {
      console.error(`  • ${err}`);
    });

    process.exit(1); // Exit the app
  }
}
```

### Custom Environment Source

By default, env-strict reads from `process.env`, but you can provide a custom source:

```javascript
// For testing
const mockEnv = {
  PORT: '8080',
  DEBUG: 'true'
};

const ENV = env({
  PORT: 'number',
  DEBUG: 'boolean'
}, mockEnv);

console.log(ENV.PORT); // 8080
```

---

## CLI Usage

### Step 1: Create Configuration File

Create `env-strict.config.js` in your project root:

```javascript
// env-strict.config.js
module.exports = {
  PORT: 'number',
  DATABASE_URL: 'url',
  DEBUG: 'boolean?',
  API_KEY: 'string',
  APP_NAME: { type: 'string', default: 'my-app' }
};
```

### Step 2: Run CLI Validation

```bash
# Make sure your .env variables are loaded
source .env

# Run validation
npx env-strict check
```

**Success output:**
```
✅ All environment variables are valid!
```

**Error output:**
```
❌ Environment validation failed:

  • PORT: Expected number, got: "abc"
  • Missing required environment variable: API_KEY
```

### CLI Help

```bash
npx env-strict --help
```

---

## Real-World Examples

### Example 1: Express.js Application

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const { env } = require('env-strict');

// Validate environment variables
const ENV = env({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: 'url',
  NODE_ENV: 'string',
  JWT_SECRET: 'string',
  REDIS_URL: 'url?',
  DEBUG: { type: 'boolean', default: false }
});

const app = express();

// Use validated env variables
if (ENV.DEBUG) {
  console.log('Debug mode enabled');
}

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
  console.log(`Environment: ${ENV.NODE_ENV}`);
  console.log(`Database: ${ENV.DATABASE_URL}`);
});
```

**.env file:**
```bash
PORT=3000
DATABASE_URL=postgresql://localhost:5432/myapp
NODE_ENV=development
JWT_SECRET=super-secret-key
DEBUG=true
```

### Example 2: Microservice Configuration

```javascript
// config.js
require('dotenv').config();
const { env } = require('env-strict');

const config = env({
  // Server
  SERVICE_NAME: { type: 'string', default: 'user-service' },
  PORT: { type: 'number', default: 8080 },

  // Database
  DB_HOST: 'string',
  DB_PORT: { type: 'number', default: 5432 },
  DB_NAME: 'string',
  DB_USER: 'string',
  DB_PASSWORD: 'string',

  // External APIs
  PAYMENT_API_URL: 'url',
  PAYMENT_API_KEY: 'string',
  EMAIL_API_URL: 'url?',

  // Features
  ENABLE_CACHE: { type: 'boolean', default: true },
  ENABLE_LOGGING: { type: 'boolean', default: true },

  // Optional
  SENTRY_DSN: 'url?',
  NEW_RELIC_KEY: 'string?'
});

module.exports = config;
```

```javascript
// app.js
const config = require('./config');

console.log(`Starting ${config.SERVICE_NAME}...`);
console.log(`Port: ${config.PORT}`);
console.log(`Database: ${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);

if (config.ENABLE_CACHE) {
  console.log('Cache enabled');
}
```

### Example 3: CI/CD Pipeline Validation

```javascript
// scripts/validate-env.js
require('dotenv').config();
const { env, ValidationError } = require('env-strict');

console.log('Validating environment variables for production...\n');

try {
  const ENV = env({
    NODE_ENV: 'string',
    DATABASE_URL: 'url',
    REDIS_URL: 'url',
    API_KEY: 'string',
    JWT_SECRET: 'string',
    SENTRY_DSN: 'url',
    PORT: 'number'
  });

  // Additional checks
  if (ENV.NODE_ENV !== 'production') {
    console.warn('⚠️  Warning: NODE_ENV is not "production"');
  }

  console.log('✅ All environment variables are valid for production!');
  process.exit(0);

} catch (error) {
  if (error instanceof ValidationError) {
    console.error('❌ Environment validation failed!\n');
    error.errors.forEach(err => console.error(`  • ${err}`));
    console.error('\nPlease fix these issues before deploying.');
    process.exit(1);
  }
  throw error;
}
```

**In your package.json:**
```json
{
  "scripts": {
    "validate:env": "node scripts/validate-env.js",
    "deploy": "npm run validate:env && deploy-script"
  }
}
```

---

## TypeScript Support

env-strict includes TypeScript definitions. However, note that in v1, the return type is not automatically inferred.

```typescript
import { env, EnvSchema, ValidationError } from 'env-strict';

const schema = {
  PORT: 'number',
  DATABASE_URL: 'url',
  DEBUG: 'boolean?'
} as const;

const ENV = env(schema);

// ENV.PORT is typed as 'any' in v1
// Type inference will be added in v3
```

**Workaround for better typing:**
```typescript
interface AppEnv {
  PORT: number;
  DATABASE_URL: string;
  DEBUG: boolean | undefined;
  APP_NAME: string;
}

const ENV = env({
  PORT: 'number',
  DATABASE_URL: 'url',
  DEBUG: 'boolean?',
  APP_NAME: { type: 'string', default: 'my-app' }
}) as AppEnv;

// Now ENV.PORT is properly typed as number
```

---

## Troubleshooting

### Issue 1: "jest is not recognized" (Windows)

**Problem:** Running npm test shows "jest is not recognized"

**Solution:** You're mixing Windows and WSL environments.

**Option A - Use WSL:**
```bash
# Open WSL terminal
cd /mnt/c/path/to/your/project
npm test
```

**Option B - Reinstall in Windows:**
```cmd
cd C:\path\to\your\project
rmdir /s /q node_modules
npm install
npm test
```

### Issue 2: Validation Fails in CLI but Works in Code

**Problem:** `npx env-strict check` shows missing variables

**Solution:** The CLI doesn't auto-load `.env` files. Source them first:

```bash
# Linux/Mac/WSL
source .env && npx env-strict check

# Or use dotenv-cli
npx dotenv-cli npx env-strict check
```

### Issue 3: "Expected number, got: NaN"

**Problem:** Number parsing fails

**Solution:** Check that your .env value is a valid number:

```bash
# ❌ Wrong
PORT=abc
PORT=3000px

# ✅ Correct
PORT=3000
PORT=3.14
```

### Issue 4: "Expected boolean, got: yes"

**Problem:** Boolean parsing fails

**Solution:** Only these values are valid booleans:
- `true`, `TRUE`, `1` → parsed as `true`
- `false`, `FALSE`, `0` → parsed as `false`

```bash
# ❌ Wrong
DEBUG=yes
DEBUG=on

# ✅ Correct
DEBUG=true
DEBUG=false
DEBUG=1
DEBUG=0
```

### Issue 5: URL Validation Fails

**Problem:** Valid-looking URL fails validation

**Solution:** The URL must be parseable by JavaScript's `URL()` constructor:

```bash
# ❌ Wrong (missing protocol)
DATABASE_URL=localhost:5432

# ✅ Correct
DATABASE_URL=postgresql://localhost:5432/mydb
DATABASE_URL=https://api.example.com
DATABASE_URL=redis://localhost:6379
```

### Issue 6: Cannot Find Module 'env-strict'

**Problem:** `Error: Cannot find module 'env-strict'`

**Solution:** Make sure you've installed the package:

```bash
# Check if installed
npm list env-strict

# If not installed
npm install /path/to/env-strict
# or
npm install env-strict  # if published
```

### Issue 7: Changes to env-strict Not Reflected

**Problem:** You made changes to env-strict code but don't see them in your project

**Solution:** Rebuild env-strict and reinstall:

```bash
# In env-strict directory
cd /path/to/env-strict
npm run build

# In your project
cd /path/to/your-project
npm install /path/to/env-strict --force
```

---

## Best Practices

### 1. Validate Early
Place env validation at the very top of your entry file:
```javascript
// index.js - First thing!
require('dotenv').config();
const { env } = require('env-strict');

const ENV = env({ /* schema */ });

// Rest of your imports and code...
```

### 2. Use .env.example
Create a template for other developers:
```bash
# .env.example
PORT=3000
DATABASE_URL=postgresql://localhost:5432/dbname
DEBUG=false
API_KEY=your-api-key-here
```

### 3. Don't Commit .env
Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 4. Validate in CI/CD
Add validation to your deployment pipeline:
```json
{
  "scripts": {
    "validate:env": "node scripts/validate-env.js",
    "predeploy": "npm run validate:env"
  }
}
```

### 5. Document Required Variables
Keep your schema in a separate file:
```javascript
// config/env-schema.js
module.exports = {
  // Server Configuration
  PORT: { type: 'number', default: 3000 },

  // Database
  DATABASE_URL: 'url',

  // External Services
  API_KEY: 'string',

  // Feature Flags
  ENABLE_CACHE: { type: 'boolean', default: true }
};
```

---

## Support

For issues and questions:
- GitHub Issues: [Your repo URL]
- Documentation: See README.md

---

## What's Next?

- **v2** will add enum validation, min/max constraints, regex patterns
- **v3** will add TypeScript type generation and auto-complete support

Stay tuned for updates!
