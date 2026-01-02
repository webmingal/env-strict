env-strict – Project Overview

Strict validation for your environment variables.

🧩 Vision

env-strict helps developers fail fast when environment configuration is wrong — before apps crash in production.

The project evolves in clear phases to keep scope manageable while allowing long-term growth.

🚀 v1 – Core Validation Engine (MVP)

Goal:
Catch missing or invalid environment variables at app startup with clear errors.

Status: MVP / First public release

Core Capabilities

Load environment variables from process.env

Schema-based validation

Required vs optional variables

Default values support

Automatic type parsing

Developer-friendly error messages

Supported Types

string

number

boolean

url

API Example
import { env } from "env-strict";

const ENV = env({
  PORT: "number",
  DATABASE_URL: "url",
  DEBUG: "boolean?",
  APP_NAME: { type: "string", default: "my-app" }
});

CLI (Basic)
npx env-strict check


Validates environment variables

Prints readable error output

Exits with non-zero code on failure

Out of Scope (Intentionally)

Type generation

Multi-environment support

Secret masking

CI/CD helpers

Dashboards or UI

🔧 v2 – Developer Experience & Flexibility

Goal:
Improve usability, expressiveness, and DX without increasing operational complexity.

Enhancements

Enum / allowed values

Min / max constraints for numbers

String length validation

Regex pattern matching

Custom validation functions

Transformation helpers (trim, lowercase, uppercase)

Improved CLI output formatting

Generate .env.example from schema

API Example
env({
  NODE_ENV: { type: "string", enum: ["development", "production"] },
  PORT: { type: "number", min: 1000, max: 9999 },
  API_KEY: { type: "string", required: true }
});

CLI Additions
npx env-strict generate


Auto-generate .env.example

Show missing variables

Highlight unsafe defaults

🧠 v3 – Type Safety & Environment Awareness

Goal:
Make environment configuration type-safe, environment-aware, and CI-friendly.

Advanced Features

TypeScript type generation

IDE auto-complete for env access

Environment-specific schemas (dev / staging / prod)

Multi-file support (.env, .env.local, .env.production)

Validation reports (JSON / CLI)

CI/CD integration helpers

Example
env({
  shared: {
    APP_NAME: "string"
  },
  production: {
    DATABASE_URL: "url"
  }
});

Tooling

env-strict typegen

env-strict report

🛣️ Guiding Principles

Fail fast, fail clearly

Small surface area

Zero runtime magic

Explicit over implicit

Ship early, improve often

📌 Long-Term Ideas (Not Scheduled)

Secrets masking in logs

Git hooks integration

Remote config comparison

Cloud secrets adapters

Web UI (only if justified)

🏁 Summary

v1: Stability and correctness

v2: Developer experience

v3: Type safety and scale

Each version builds on the previous one without breaking core simplicity.