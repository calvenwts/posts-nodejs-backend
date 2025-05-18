// Import test utilities and mock Prisma before importing PostService
import { mockPrisma, mockPrismaClient } from '../utils/prismaMock';
import { createPost, createPostWithAuthor, createPosts } from '../utils/factories/postFactory';

// Set up mocks
mockPrisma();

// Import the service after mocking
import { PostService } from '../../src/services/postService';

describe('PostService', () => {
  let postService: PostService;

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    postService = new PostService();
  });

  describe('createPost', () => {
    it('should create a post with the given data', async () => {
      // Arrange
      const mockPost = createPostWithAuthor();

      mockPrismaClient.post.create.mockResolvedValue(mockPost);

      // Act
      const result = await postService.createPost('Test Post', 'Test content', 1);

      // Assert
      expect(mockPrismaClient.post.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: 1,
        },
        include: {
          author: true,
        },
      });

      expect(result).toEqual(mockPost);
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      // Arrange
      const mockPost = createPostWithAuthor();
      mockPrismaClient.post.findUnique.mockResolvedValue(mockPost);

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(mockPrismaClient.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          author: true,
        },
      });

      expect(result).toEqual(mockPost);
    });

    it('should return null if post not found', async () => {
      // Arrange
      mockPrismaClient.post.findUnique.mockResolvedValue(null);

      // Act
      const result = await postService.getPostById(999);

      // Assert
      expect(mockPrismaClient.post.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          author: true,
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      // Arrange
      const mockPosts = createPosts(2).map((post) => createPostWithAuthor({ ...post }));
      mockPrismaClient.post.findMany.mockResolvedValue(mockPosts);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(mockPrismaClient.post.findMany).toHaveBeenCalledWith({
        include: {
          author: true,
        },
      });

      expect(result).toEqual(mockPosts);
    });
  });

  describe('updatePost', () => {
    it('should update a post with the given data', async () => {
      // Arrange
      const mockUpdatedPost = createPostWithAuthor({
        title: 'Updated Post',
        content: 'Updated content',
        published: true,
      });

      mockPrismaClient.post.update.mockResolvedValue(mockUpdatedPost);

      // Act
      const result = await postService.updatePost(1, {
        title: 'Updated Post',
        content: 'Updated content',
        published: true,
      });

      // Assert
      expect(mockPrismaClient.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Post',
          content: 'Updated content',
          published: true,
        },
        include: {
          author: true,
        },
      });

      expect(result).toEqual(mockUpdatedPost);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      // Arrange
      const mockDeletedPost = createPost();

      mockPrismaClient.post.delete.mockResolvedValue(mockDeletedPost);

      // Act
      const result = await postService.deletePost(1);

      // Assert
      expect(mockPrismaClient.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(mockDeletedPost);
    });
  });
});
