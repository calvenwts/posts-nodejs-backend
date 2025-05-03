import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { User } from '@prisma/client';

export class UserService {
  async createUser(email: string, name: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
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

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async updateUser(
    id: number,
    data: { email?: string; name?: string; password?: string },
  ): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
