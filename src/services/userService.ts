import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { User } from '@prisma/client';

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
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        console.error('Duplicate email error:', error);
        throw new Error('Email already exists');
      }
      if (error.code === 'P2021') {
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
}
