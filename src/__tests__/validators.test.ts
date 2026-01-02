import { parseValue, isValidType } from '../validators';

describe('parseValue', () => {
  describe('string', () => {
    it('should return the value as-is', () => {
      expect(parseValue('hello', 'string')).toBe('hello');
      expect(parseValue('123', 'string')).toBe('123');
    });
  });

  describe('number', () => {
    it('should parse valid numbers', () => {
      expect(parseValue('42', 'number')).toBe(42);
      expect(parseValue('3.14', 'number')).toBe(3.14);
      expect(parseValue('-10', 'number')).toBe(-10);
    });

    it('should throw on invalid numbers', () => {
      expect(() => parseValue('abc', 'number')).toThrow('Expected number');
      expect(() => parseValue('12abc', 'number')).toThrow('Expected number');
    });
  });

  describe('boolean', () => {
    it('should parse true values', () => {
      expect(parseValue('true', 'boolean')).toBe(true);
      expect(parseValue('TRUE', 'boolean')).toBe(true);
      expect(parseValue('1', 'boolean')).toBe(true);
    });

    it('should parse false values', () => {
      expect(parseValue('false', 'boolean')).toBe(false);
      expect(parseValue('FALSE', 'boolean')).toBe(false);
      expect(parseValue('0', 'boolean')).toBe(false);
    });

    it('should throw on invalid booleans', () => {
      expect(() => parseValue('yes', 'boolean')).toThrow('Expected boolean');
      expect(() => parseValue('no', 'boolean')).toThrow('Expected boolean');
    });
  });

  describe('url', () => {
    it('should validate correct URLs', () => {
      expect(parseValue('https://example.com', 'url')).toBe('https://example.com');
      expect(parseValue('http://localhost:3000', 'url')).toBe('http://localhost:3000');
      expect(parseValue('postgresql://user:pass@host/db', 'url')).toBe('postgresql://user:pass@host/db');
    });

    it('should throw on invalid URLs', () => {
      expect(() => parseValue('not-a-url', 'url')).toThrow('Expected valid URL');
      expect(() => parseValue('http://', 'url')).toThrow('Expected valid URL');
    });
  });
});

describe('isValidType', () => {
  it('should validate correct types', () => {
    expect(isValidType('string')).toBe(true);
    expect(isValidType('number')).toBe(true);
    expect(isValidType('boolean')).toBe(true);
    expect(isValidType('url')).toBe(true);
  });

  it('should reject invalid types', () => {
    expect(isValidType('array')).toBe(false);
    expect(isValidType('object')).toBe(false);
    expect(isValidType('invalid')).toBe(false);
  });
});
