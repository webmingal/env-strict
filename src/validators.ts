import { EnvType } from './types';

export function parseValue(value: string, type: EnvType): string | number | boolean {
  switch (type) {
    case 'string':
      return value;

    case 'number': {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Expected number, got: "${value}"`);
      }
      return num;
    }

    case 'boolean': {
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
      throw new Error(`Expected boolean (true/false), got: "${value}"`);
    }

    case 'url': {
      try {
        new URL(value);
        return value;
      } catch {
        throw new Error(`Expected valid URL, got: "${value}"`);
      }
    }

    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export function isValidType(type: string): type is EnvType {
  return ['string', 'number', 'boolean', 'url'].includes(type);
}
