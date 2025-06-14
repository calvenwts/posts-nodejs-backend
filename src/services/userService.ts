import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { User } from '@prisma/client';
import { generateToken } from '../utils/jwt';

function isPrismaError(error: unknown): error is { code: string; meta?: { target?: string[] } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  );
}

export class UserService {
  async createUser(email: string, name: string, password: string): Promise<Omit<User, 'password'>> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        isPrismaError(error) &&
        error.code === 'P2002' &&
        error.meta?.target?.includes('email')
      ) {
        console.error('Duplicate email error:', error);
        throw new Error('Email already exists');
      }
      if (error instanceof Error && isPrismaError(error) && error.code === 'P2021') {
        console.error('Database schema error:', error);
        throw new Error('User table does not exist in the database');
      }
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async updateUser(
    id: number,
    data: { email?: string; name?: string; password?: string },
  ): Promise<Omit<User, 'password'>> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id, user.email);

    const { id, email: userEmail, name, createdAt, updatedAt } = user;
    return { token, user: { id, email: userEmail, name, createdAt, updatedAt } };
  }
}
