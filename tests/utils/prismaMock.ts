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

export const mockPrisma = (): void => {
  jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn(() => mockPrismaClient),
    };
  });

  jest.mock('../../src/lib/prisma', () => {
    return {
      __esModule: true,
      default: mockPrismaClient,
    };
  });
};
