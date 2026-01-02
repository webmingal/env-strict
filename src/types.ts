export type EnvType = 'string' | 'number' | 'boolean' | 'url';

export interface EnvVarConfig {
  type: EnvType;
  default?: string | number | boolean;
  required?: boolean;
}

export type EnvSchema = {
  [key: string]: EnvType | `${EnvType}?` | EnvVarConfig;
};

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
