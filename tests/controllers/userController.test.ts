// Import test utilities and mock UserService
import {
  mockUserService,
  mockUserServiceMethods,
  IMockUserService,
} from '../utils/userServiceMock';
import { createMockResponse } from '../utils/expressMock';
import { createUser, createUsers } from '../utils/factories/userFactory';

// Set up mocks
mockUserService();

// Import after mocking
import { Request, Response } from 'express';
import { UserController } from '../../src/controllers/userController';

describe('UserController', () => {
  let userController: UserController;
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
    userController = new UserController(mockUserServiceMethods as IMockUserService);
  });

  describe('createUser', () => {
    it('should create a user and return 201 status code', async () => {
      // Arrange
      const mockUser = createUser();

      mockRequest = {
        body: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        },
      };

      mockUserServiceMethods.createUser.mockResolvedValue(mockUser);

      // Act
      await userController.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserServiceMethods.createUser).toHaveBeenCalledWith(
        'test@example.com',
        'Test User',
        'password123',
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors and return 400 status code', async () => {
      // Arrange
      mockRequest = {
        body: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        },
      };

      mockUserServiceMethods.createUser.mockRejectedValue(new Error('Database error'));

      // Act
      await userController.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create user' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id and 200 status code', async () => {
      // Arrange
      const mockUser = createUser();

      mockRequest = {
        params: {
          id: '1',
        },
      };

      mockUserServiceMethods.getUserById.mockResolvedValue(mockUser);

      // Act
      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserServiceMethods.getUserById).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user is not found', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: '999',
        },
      };

      mockUserServiceMethods.getUserById.mockResolvedValue(null);

      // Act
      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const mockUsers = createUsers(2);

      mockRequest = {};
      mockUserServiceMethods.getAllUsers.mockResolvedValue(mockUsers);

      // Act
      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserServiceMethods.getAllUsers).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors and return 400 status code', async () => {
      // Arrange
      mockRequest = {};
      mockUserServiceMethods.getAllUsers.mockRejectedValue(new Error('Database error'));

      // Act
      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to get users' });
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      // Arrange
      const mockUser = createUser({
        email: 'updated@example.com',
        name: 'Updated User',
      });

      mockRequest = {
        params: {
          id: '1',
        },
        body: {
          email: 'updated@example.com',
          name: 'Updated User',
        },
      };

      mockUserServiceMethods.updateUser.mockResolvedValue(mockUser);

      // Act
      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserServiceMethods.updateUser).toHaveBeenCalledWith(1, {
        email: 'updated@example.com',
        name: 'Updated User',
        password: undefined,
      });
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return 204 status code', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: '1',
        },
      };

      mockUserServiceMethods.deleteUser.mockResolvedValue(
        createUser({
          email: 'deleted@example.com',
          name: 'Deleted User',
        }),
      );

      // Act
      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserServiceMethods.deleteUser).toHaveBeenCalledWith(1);
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

      mockUserServiceMethods.deleteUser.mockRejectedValue(new Error('Database error'));

      // Act
      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to delete user' });
    });
  });

  describe('login', () => {
    it('should login successfully and return token and user data', async () => {
      // Arrange
      const mockUser = createUser();
      const mockToken = 'mock.jwt.token';

      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      mockUserServiceMethods.login.mockResolvedValue({
        token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      });

      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserServiceMethods.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(jsonMock).toHaveBeenCalledWith({
        token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      });
    });

    it('should return 401 for invalid credentials', async () => {
      // Arrange
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      };

      mockUserServiceMethods.login.mockRejectedValue(new Error('Invalid credentials'));

      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 400 for other errors', async () => {
      // Arrange
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      mockUserServiceMethods.login.mockRejectedValue(new Error('Database error'));

      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to login' });
    });
  });
});
