import { User } from '@prisma/client';

export interface IUserService {
  createUser(email: string, name: string, password: string): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, data: { email?: string; name?: string; password?: string }): Promise<User>;
  deleteUser(id: number): Promise<User>;
  login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }>;
}

export interface IMockUserService extends IUserService {
  createUser: jest.Mock<Promise<User>, [string, string, string]>;
  getUserById: jest.Mock<Promise<User | null>, [number]>;
  getUserByEmail: jest.Mock<Promise<User | null>, [string]>;
  getAllUsers: jest.Mock<Promise<User[]>, []>;
  updateUser: jest.Mock<
    Promise<User>,
    [number, { email?: string; name?: string; password?: string }]
  >;
  deleteUser: jest.Mock<Promise<User>, [number]>;
  login: jest.Mock<Promise<{ token: string; user: Omit<User, 'password'> }>, [string, string]>;
}

export const mockUserServiceMethods: IMockUserService = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  getAllUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  login: jest.fn(),
};

export const mockUserService = (): void => {
  jest.mock('../../src/services/userService', () => {
    return {
      UserService: jest.fn().mockImplementation(() => mockUserServiceMethods),
    };
  });
};
