import { PrismaClient, Post, User } from '@prisma/client';

const prisma = new PrismaClient();

export class PostService {
  async createPost(
    title: string,
    content: string,
    authorId: number,
  ): Promise<Post & { author: User }> {
    return prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        author: true,
      },
    });
  }

  async getPostById(id: number): Promise<(Post & { author: User }) | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async getAllPosts(): Promise<(Post & { author: User })[]> {
    return prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async updatePost(
    id: number,
    data: { title?: string; content?: string; published?: boolean },
  ): Promise<Post & { author: User }> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async deletePost(id: number): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    });
  }
}
