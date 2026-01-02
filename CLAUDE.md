# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**env-strict** is an environment variable validation library that helps developers fail fast when environment configuration is wrong. The project is designed to evolve in phases from MVP to full type-safety and CI/CD integration.

## Architecture & Phased Development

The project follows a three-phase roadmap:

### v1 – Core Validation Engine (MVP)
- Schema-based validation for environment variables from `process.env`
- Support for types: `string`, `number`, `boolean`, `url`
- Required vs optional variables (using `?` suffix syntax)
- Default values support
- Developer-friendly error messages
- Basic CLI: `npx env-strict check`

API pattern:
```javascript
const ENV = env({
  PORT: "number",
  DATABASE_URL: "url",
  DEBUG: "boolean?",
  APP_NAME: { type: "string", default: "my-app" }
});
```

### v2 – Developer Experience & Flexibility
- Enum/allowed values validation
- Min/max constraints for numbers
- String length and regex pattern validation
- Custom validation functions
- Transformation helpers (trim, lowercase, uppercase)
- CLI command to generate `.env.example` from schema

### v3 – Type Safety & Environment Awareness
- TypeScript type generation with IDE auto-complete
- Environment-specific schemas (dev/staging/prod)
- Multi-file support (.env, .env.local, .env.production)
- Validation reports (JSON/CLI output)
- CI/CD integration helpers
- CLI: `env-strict typegen`, `env-strict report`

## Guiding Principles

When implementing features:
- **Fail fast, fail clearly** – Validation errors should be immediate and actionable
- **Small surface area** – Keep the API minimal and focused
- **Zero runtime magic** – Avoid hidden behaviors and implicit transformations
- **Explicit over implicit** – Make configuration requirements obvious
- **Ship early, improve often** – Favor incremental releases over large changes

## Development Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Compile in watch mode
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run clean` - Remove dist directory

## Project Structure

```
src/
├── index.ts          # Main exports
├── env.ts            # Core validation engine
├── types.ts          # Type definitions
├── validators.ts     # Value parsing and validation
├── cli.ts            # CLI tool
└── __tests__/        # Test files
```

## Implementation Notes

- Do NOT implement features from later phases when working on earlier phases
- Intentionally out of scope for v1: type generation, multi-environment support, secret masking, CI/CD helpers, dashboards
- Each version must build on the previous without breaking core simplicity
- Validation should happen at app startup, not lazily at runtime
- The `env()` function accepts a schema and optional source (defaults to `process.env`)
- Type parsing happens via `validators.ts` - all new types should be added there
- CLI requires a `env-strict.config.js` file in the project root
