import { User } from '@prisma/client';

export interface CreateUserData {
  id?: number;
  email?: string;
  name?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createUser = (overrides: CreateUserData = {}): User => {
  const now = new Date();
  return {
    id: overrides.id ?? 1,
    email: overrides.email ?? 'test@example.com',
    name: overrides.name ?? 'Test User',
    password: overrides.password ?? 'hashed_password123',
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
};

export const createUsers = (count: number, overrides: CreateUserData = {}): User[] => {
  return Array.from({ length: count }, (_, index) =>
    createUser({
      id: index + 1,
      email: `test${index + 1}@example.com`,
      name: `Test User ${index + 1}`,
      ...overrides,
    }),
  );
};
