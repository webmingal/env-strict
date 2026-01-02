# env-strict Quick Reference

## Installation

```bash
npm install env-strict
npm install dotenv  # To load .env files
```

## Basic Usage

```javascript
require('dotenv').config();
const { env } = require('env-strict');

const ENV = env({
  PORT: 'number',
  API_KEY: 'string',
  DEBUG: 'boolean?',  // Optional
  APP_NAME: { type: 'string', default: 'app' }  // With default
});
```

## Type Reference

| Type | `.env` Example | Parsed Value |
|------|----------------|--------------|
| `string` | `NAME=myapp` | `"myapp"` |
| `number` | `PORT=3000` | `3000` |
| `boolean` | `DEBUG=true` | `true` |
| `url` | `API=https://api.com` | `"https://api.com"` |

## Syntax Cheat Sheet

```javascript
// Required
PORT: 'number'

// Optional (using ?)
DEBUG: 'boolean?'

// With default
PORT: { type: 'number', default: 3000 }

// Object syntax (optional)
DEBUG: { type: 'boolean', required: false }
```

## Boolean Values

Valid boolean values in `.env`:
- **True:** `true`, `TRUE`, `1`
- **False:** `false`, `FALSE`, `0`

## Error Handling

```javascript
const { env, ValidationError } = require('env-strict');

try {
  const ENV = env({ /* schema */ });
} catch (error) {
  if (error instanceof ValidationError) {
    error.errors.forEach(err => console.error(err));
  }
}
```

## CLI Usage

```bash
# 1. Create env-strict.config.js
module.exports = {
  PORT: 'number',
  API_KEY: 'string'
};

# 2. Run validation
source .env && npx env-strict check
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Expected number" | Check .env has valid number (no letters) |
| "Expected boolean" | Use: true/false/1/0 (not yes/no) |
| "Expected valid URL" | Must include protocol (http://, postgresql://) |
| "Missing required variable" | Add to .env or make optional with `?` |

## Full Example

**.env:**
```bash
PORT=3000
DATABASE_URL=postgresql://localhost/db
DEBUG=true
API_KEY=secret-123
```

**app.js:**
```javascript
require('dotenv').config();
const { env } = require('env-strict');

const ENV = env({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: 'url',
  DEBUG: 'boolean?',
  API_KEY: 'string',
  APP_NAME: { type: 'string', default: 'my-app' }
});

console.log(ENV.PORT);  // 3000 (number)
console.log(ENV.DEBUG); // true (boolean)
```

---

For detailed guide, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
