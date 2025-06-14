import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../src/middleware/auth';

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication token required' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is not in Bearer format', () => {
    mockRequest.headers = {
      authorization: 'InvalidToken',
    };

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication token required' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 500 if JWT_SECRET is not configured', () => {
    delete process.env.JWT_SECRET;
    mockRequest.headers = {
      authorization: 'Bearer valid.token.here',
    };

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid.token.here',
    };

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, 'test-secret');
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    const reqWithUser = mockRequest as Partial<Request> & { user?: { id: number; email: string } };
    expect(reqWithUser.user).toMatchObject({
      id: 1,
      email: 'test@example.com',
    });
  });
});
