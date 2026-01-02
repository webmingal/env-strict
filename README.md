
# env-strict
=======
# env-strict

Strict validation for your environment variables - fail fast when configuration is wrong.

## Installation

```bash
npm install env-strict
```

## Quick Start

```javascript
import { env } from 'env-strict';

const ENV = env({
  PORT: 'number',
  DATABASE_URL: 'url',
  DEBUG: 'boolean?',
  APP_NAME: { type: 'string', default: 'my-app' }
});

console.log(ENV.PORT);         // 3000 (as number)
console.log(ENV.DATABASE_URL); // validated URL string
console.log(ENV.DEBUG);        // true/false or undefined
console.log(ENV.APP_NAME);     // 'my-app' (default value)
```

## Supported Types

- `string` - Any string value
- `number` - Parsed to JavaScript number
- `boolean` - Accepts: `true`, `false`, `1`, `0` (case-insensitive)
- `url` - Validated URL string

## Schema Syntax

### Required Variables

```javascript
const ENV = env({
  API_KEY: 'string',
  PORT: 'number'
});
```

### Optional Variables (using `?` suffix)

```javascript
const ENV = env({
  DEBUG: 'boolean?',
  OPTIONAL_URL: 'url?'
});
```

### Default Values

```javascript
const ENV = env({
  PORT: { type: 'number', default: 3000 },
  APP_NAME: { type: 'string', default: 'my-app' }
});
```

### Object Config Syntax

```javascript
const ENV = env({
  API_KEY: { type: 'string', required: true },
  DEBUG: { type: 'boolean', required: false },
  PORT: { type: 'number', default: 8080 }
});
```

## CLI Usage

Create a `env-strict.config.js` file in your project root:

```javascript
module.exports = {
  PORT: 'number',
  DATABASE_URL: 'url',
  DEBUG: 'boolean?',
  APP_NAME: { type: 'string', default: 'my-app' }
};
```

Then run:

```bash
npx env-strict check
```

## Error Handling

When validation fails, env-strict throws a `ValidationError` with detailed information:

```javascript
import { env, ValidationError } from 'env-strict';

try {
  const ENV = env({
    PORT: 'number',
    API_KEY: 'string'
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.message);
    error.errors.forEach(err => console.error(err));
  }
}
```

## License

MIT
