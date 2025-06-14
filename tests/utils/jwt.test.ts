import jwt from 'jsonwebtoken';
import { generateToken } from '../../src/utils/jwt';

describe('JWT Utility', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should generate a valid JWT token', () => {
    const userId = 1;
    const email = 'test@example.com';
    const token = generateToken(userId, email);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, 'test-secret') as {
      id: number;
      email: string;
      exp: number;
      iat: number;
    };
    expect(decoded.id).toBe(userId);
    expect(decoded.email).toBe(email);
    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
  });

  it('should throw error if JWT_SECRET is not configured', () => {
    delete process.env.JWT_SECRET;

    expect(() => generateToken(1, 'test@example.com')).toThrow('JWT_SECRET is not configured');
  });

  it('should generate token with expiration', () => {
    const token = generateToken(1, 'test@example.com');
    const decoded = jwt.decode(token) as { exp: number };

    expect(decoded.exp).toBeDefined();
    // Token should expire in 24 hours
    const expectedExp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    expect(decoded.exp).toBeCloseTo(expectedExp, -2); // Allow 2 digits of precision
  });
});
