import { EnvSchema, EnvVarConfig, EnvType, ValidationError } from './types';
import { parseValue, isValidType } from './validators';

export function env<T extends EnvSchema>(
  schema: T,
  source: Record<string, string | undefined> = process.env
): { [K in keyof T]: any } {
  const errors: string[] = [];
  const result: Record<string, any> = {};

  for (const [key, configValue] of Object.entries(schema)) {
    try {
      const value = source[key];
      const config = normalizeConfig(configValue);

      // Check if variable is required
      if (config.required && value === undefined) {
        if (config.default !== undefined) {
          result[key] = config.default;
        } else {
          errors.push(`Missing required environment variable: ${key}`);
        }
        continue;
      }

      // Handle optional variables
      if (!config.required && value === undefined) {
        if (config.default !== undefined) {
          result[key] = config.default;
        } else {
          result[key] = undefined;
        }
        continue;
      }

      // Parse and validate the value
      if (value !== undefined) {
        result[key] = parseValue(value, config.type);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${key}: ${message}`);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(
      `Environment validation failed with ${errors.length} error(s)`,
      errors
    );
  }

  return result as any;
}

function normalizeConfig(
  configValue: string | EnvVarConfig
): { type: EnvType; required: boolean; default: string | number | boolean | undefined } {
  // Handle string with optional marker (e.g., "string?")
  if (typeof configValue === 'string') {
    const isOptional = configValue.endsWith('?');
    const type = isOptional ? configValue.slice(0, -1) : configValue;

    if (!isValidType(type)) {
      throw new Error(`Invalid type: ${type}`);
    }

    return {
      type,
      required: !isOptional,
      default: undefined,
    };
  }

  // Handle object config
  if (!isValidType(configValue.type)) {
    throw new Error(`Invalid type: ${configValue.type}`);
  }

  return {
    type: configValue.type,
    required: configValue.required ?? true,
    default: configValue.default,
  };
}
