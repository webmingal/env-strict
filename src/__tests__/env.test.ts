import { env } from '../env';
import { ValidationError } from '../types';

describe('env', () => {
  describe('string type', () => {
    it('should parse string values', () => {
      const result = env(
        { NAME: 'string' },
        { NAME: 'test-app' }
      );
      expect(result.NAME).toBe('test-app');
    });

    it('should handle optional strings', () => {
      const result = env(
        { NAME: 'string?' },
        {}
      );
      expect(result.NAME).toBeUndefined();
    });

    it('should use default value', () => {
      const result = env(
        { NAME: { type: 'string', default: 'default-app' } },
        {}
      );
      expect(result.NAME).toBe('default-app');
    });

    it('should throw on missing required string', () => {
      expect(() => {
        env({ NAME: 'string' }, {});
      }).toThrow(ValidationError);
    });
  });

  describe('number type', () => {
    it('should parse number values', () => {
      const result = env(
        { PORT: 'number' },
        { PORT: '3000' }
      );
      expect(result.PORT).toBe(3000);
    });

    it('should throw on invalid number', () => {
      expect(() => {
        env({ PORT: 'number' }, { PORT: 'not-a-number' });
      }).toThrow(ValidationError);
    });

    it('should handle optional numbers', () => {
      const result = env(
        { PORT: 'number?' },
        {}
      );
      expect(result.PORT).toBeUndefined();
    });

    it('should use default number value', () => {
      const result = env(
        { PORT: { type: 'number', default: 8080 } },
        {}
      );
      expect(result.PORT).toBe(8080);
    });
  });

  describe('boolean type', () => {
    it('should parse true values', () => {
      const tests = [
        { input: 'true', expected: true },
        { input: 'TRUE', expected: true },
        { input: '1', expected: true },
      ];

      tests.forEach(({ input, expected }) => {
        const result = env({ DEBUG: 'boolean' }, { DEBUG: input });
        expect(result.DEBUG).toBe(expected);
      });
    });

    it('should parse false values', () => {
      const tests = [
        { input: 'false', expected: false },
        { input: 'FALSE', expected: false },
        { input: '0', expected: false },
      ];

      tests.forEach(({ input, expected }) => {
        const result = env({ DEBUG: 'boolean' }, { DEBUG: input });
        expect(result.DEBUG).toBe(expected);
      });
    });

    it('should throw on invalid boolean', () => {
      expect(() => {
        env({ DEBUG: 'boolean' }, { DEBUG: 'yes' });
      }).toThrow(ValidationError);
    });

    it('should handle optional booleans', () => {
      const result = env(
        { DEBUG: 'boolean?' },
        {}
      );
      expect(result.DEBUG).toBeUndefined();
    });
  });

  describe('url type', () => {
    it('should parse valid URLs', () => {
      const result = env(
        { API_URL: 'url' },
        { API_URL: 'https://api.example.com' }
      );
      expect(result.API_URL).toBe('https://api.example.com');
    });

    it('should throw on invalid URL', () => {
      expect(() => {
        env({ API_URL: 'url' }, { API_URL: 'not-a-url' });
      }).toThrow(ValidationError);
    });

    it('should handle optional URLs', () => {
      const result = env(
        { API_URL: 'url?' },
        {}
      );
      expect(result.API_URL).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should collect multiple errors', () => {
      expect(() => {
        env(
          {
            PORT: 'number',
            DEBUG: 'boolean',
            API_URL: 'url',
          },
          {
            PORT: 'not-a-number',
            DEBUG: 'invalid',
            API_URL: 'invalid-url',
          }
        );
      }).toThrow(ValidationError);
    });

    it('should include error details', () => {
      try {
        env(
          { PORT: 'number', NAME: 'string' },
          { PORT: 'abc' }
        );
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError.errors).toHaveLength(2);
        expect(validationError.errors[0]).toContain('PORT');
        expect(validationError.errors[1]).toContain('NAME');
      }
    });
  });

  describe('complex schema', () => {
    it('should handle mixed schema', () => {
      const result = env(
        {
          PORT: 'number',
          DATABASE_URL: 'url',
          DEBUG: 'boolean?',
          APP_NAME: { type: 'string', default: 'my-app' },
        },
        {
          PORT: '3000',
          DATABASE_URL: 'postgresql://localhost/db',
        }
      );

      expect(result.PORT).toBe(3000);
      expect(result.DATABASE_URL).toBe('postgresql://localhost/db');
      expect(result.DEBUG).toBeUndefined();
      expect(result.APP_NAME).toBe('my-app');
    });
  });
});
