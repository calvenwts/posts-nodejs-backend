import { Post, User } from '@prisma/client';

type PostWithAuthor = Post & {
  author: User;
};

export interface IPostService {
  createPost(title: string, content: string, authorId: number): Promise<PostWithAuthor>;
  getPostById(id: number): Promise<PostWithAuthor | null>;
  getAllPosts(): Promise<PostWithAuthor[]>;
  updatePost(
    id: number,
    data: { title?: string; content?: string; published?: boolean },
  ): Promise<PostWithAuthor>;
  deletePost(id: number): Promise<PostWithAuthor>;
}

export interface IMockPostService extends IPostService {
  createPost: jest.Mock<Promise<PostWithAuthor>, [string, string, number]>;
  getPostById: jest.Mock<Promise<PostWithAuthor | null>, [number]>;
  getAllPosts: jest.Mock<Promise<PostWithAuthor[]>, []>;
  updatePost: jest.Mock<
    Promise<PostWithAuthor>,
    [number, { title?: string; content?: string; published?: boolean }]
  >;
  deletePost: jest.Mock<Promise<PostWithAuthor>, [number]>;
}

export const mockPostServiceMethods: IMockPostService = {
  createPost: jest.fn(),
  getPostById: jest.fn(),
  getAllPosts: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

export const mockPostService = (): void => {
  jest.mock('../../src/services/postService', () => {
    return {
      PostService: jest.fn().mockImplementation(() => mockPostServiceMethods),
    };
  });
};
