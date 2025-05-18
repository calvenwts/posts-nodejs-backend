import { Post, User } from '@prisma/client';
import { createUser } from './userFactory';

type PostWithAuthor = Post & {
  author: User;
};

export interface CreatePostData {
  id?: number;
  title?: string;
  content?: string;
  published?: boolean;
  authorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  author?: User;
}

export const createPost = (overrides: Partial<Post> = {}): Post => {
  return {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    published: false,
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

export const createPostWithAuthor = (overrides: Partial<Post> = {}): PostWithAuthor => {
  const post = createPost(overrides);
  return {
    ...post,
    author: createUser(),
  };
};

export const createPosts = (count: number): Post[] => {
  return Array.from({ length: count }, (_, index) =>
    createPost({
      id: index + 1,
      title: `Test Post ${index + 1}`,
      content: `Test Content ${index + 1}`,
    }),
  );
};
