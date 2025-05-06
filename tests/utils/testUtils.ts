import { Response } from 'express';

/**
 * Prisma test utilities
 */
export const mockPrismaClient = {
  post: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// This is a global variable to access the mock implementation of bcrypt.hash
export const bcryptMock = {
  hash: jest.fn().mockImplementation((password) => `hashed_${password}`),
  compare: jest.fn().mockImplementation((password, hash) => hash === `hashed_${password}`),
};

// Mock Prisma client
export const mockPrisma = () => {
  jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn(() => mockPrismaClient),
    };
  });

  // Mock bcrypt for user service tests
  jest.mock('bcrypt', () => bcryptMock);

  // Also mock the prisma singleton from lib/prisma
  jest.mock('../../src/lib/prisma', () => {
    return {
      __esModule: true,
      default: mockPrismaClient,
    };
  });
};

/**
 * Service test utilities
 */
export const mockPostServiceMethods = {
  createPost: jest.fn(),
  getPostById: jest.fn(),
  getAllPosts: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

export const mockUserServiceMethods = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  getAllUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

// Mock PostService
export const mockPostService = () => {
  jest.mock('../../src/services/postService', () => {
    return {
      PostService: jest.fn().mockImplementation(() => mockPostServiceMethods),
    };
  });
};

// Mock UserService
export const mockUserService = () => {
  jest.mock('../../src/services/userService', () => {
    return {
      UserService: jest.fn().mockImplementation(() => mockUserServiceMethods),
    };
  });
};

/**
 * Controller test utilities
 */
export const createMockResponse = () => {
  const jsonMock = jest.fn().mockReturnThis();
  const statusMock = jest.fn().mockReturnThis();
  const sendMock = jest.fn().mockReturnThis();

  const mockResponse = {
    json: jsonMock,
    status: statusMock,
    send: sendMock,
  } as Partial<Response>;

  return { jsonMock, statusMock, sendMock, mockResponse };
};
