// Import test utilities and mock PostService
import {
  mockPostService,
  mockPostServiceMethods,
  IMockPostService,
} from '../utils/postServiceMock';
import { createMockResponse } from '../utils/expressMock';
import { createPostWithAuthor, createPosts } from '../utils/factories/postFactory';

// Set up mocks
mockPostService();

// Import after mocking
import { Request, Response } from 'express';
import { PostController } from '../../src/controllers/postController';

describe('PostController', () => {
  let postController: PostController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup response mock
    const mocks = createMockResponse();
    jsonMock = mocks.jsonMock;
    statusMock = mocks.statusMock;
    sendMock = mocks.sendMock;
    mockResponse = mocks.mockResponse;

    // Initialize controller with mock service methods
    postController = new PostController(mockPostServiceMethods as IMockPostService);
  });

  describe('createPost', () => {
    it('should create a post and return 201 status code', async () => {
      // Arrange
      const mockPost = createPostWithAuthor();

      mockRequest = {
        body: {
          title: 'Test Post',
          content: 'Test Content',
          authorId: 1,
        },
      };

      mockPostServiceMethods.createPost.mockResolvedValue(mockPost);

      // Act
      await postController.createPost(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockPostServiceMethods.createPost).toHaveBeenCalledWith(
        'Test Post',
        'Test Content',
        1,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockPost);
    });

    it('should handle errors and return 400 status code', async () => {
      // Arrange
      mockRequest = {
        body: {
          title: 'Test Post',
          content: 'Test Content',
          authorId: 1,
        },
      };

      mockPostServiceMethods.createPost.mockRejectedValue(new Error('Database error'));

      // Act
      await postController.createPost(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create post' });
    });
  });

  describe('getPostById', () => {
    it('should return a post by id and 200 status code', async () => {
      // Arrange
      const mockPost = createPostWithAuthor();

      mockRequest = {
        params: {
          id: '1',
        },
      };

      mockPostServiceMethods.getPostById.mockResolvedValue(mockPost);

      // Act
      await postController.getPostById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockPostServiceMethods.getPostById).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(mockPost);
    });

    it('should return 404 when post is not found', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: '999',
        },
      };

      mockPostServiceMethods.getPostById.mockResolvedValue(null);

      // Act
      await postController.getPostById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Post not found' });
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      // Arrange
      const mockPosts = createPosts(1).map((post) => createPostWithAuthor({ ...post }));

      mockRequest = {};
      mockPostServiceMethods.getAllPosts.mockResolvedValue(mockPosts);

      // Act
      await postController.getAllPosts(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockPostServiceMethods.getAllPosts).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockPosts);
    });

    it('should handle errors and return 400 status code', async () => {
      // Arrange
      mockRequest = {};
      mockPostServiceMethods.getAllPosts.mockRejectedValue(new Error('Database error'));

      // Act
      await postController.getAllPosts(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to get posts' });
    });
  });

  describe('updatePost', () => {
    it('should update a post and return the updated post', async () => {
      // Arrange
      const mockPost = createPostWithAuthor({
        title: 'Updated Post',
        content: 'Updated Content',
        published: true,
      });

      mockRequest = {
        params: {
          id: '1',
        },
        body: {
          title: 'Updated Post',
          content: 'Updated Content',
          published: true,
        },
      };

      mockPostServiceMethods.updatePost.mockResolvedValue(mockPost);

      // Act
      await postController.updatePost(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockPostServiceMethods.updatePost).toHaveBeenCalledWith(1, {
        title: 'Updated Post',
        content: 'Updated Content',
        published: true,
      });
      expect(jsonMock).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return 204 status code', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: '1',
        },
      };

      mockPostServiceMethods.deletePost.mockResolvedValue(createPostWithAuthor());

      // Act
      await postController.deletePost(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockPostServiceMethods.deletePost).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should handle errors and return 400 status code', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: '1',
        },
      };

      mockPostServiceMethods.deletePost.mockRejectedValue(new Error('Database error'));

      // Act
      await postController.deletePost(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to delete post' });
    });
  });
});
