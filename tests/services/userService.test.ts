// Import test utilities and mock Prisma before importing UserService
import { mockPrisma, mockPrismaClient } from '../utils/prismaMock';
import { mockBcrypt, bcryptjsMock } from '../utils/bcryptMock';
import { createUser, createUsers } from '../utils/factories/userFactory';

// Set up mocks
mockPrisma();
mockBcrypt();

// Import after mocking
import { UserService } from '../../src/services/userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a user with the given data and hash the password', async () => {
      // Arrange
      const mockUser = createUser();

      // Setup password hashing mock
      bcryptjsMock.hash.mockReturnValueOnce('hashed_password123');
      mockPrismaClient.user.create.mockResolvedValue(mockUser);

      // Act
      const result = await userService.createUser('test@example.com', 'Test User', 'password123');

      // Assert
      expect(bcryptjsMock.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashed_password123',
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      // Arrange
      const mockUser = createUser();
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(1);

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await userService.getUserById(999);

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserByEmail('test@example.com');

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const mockUsers = createUsers(2);
      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUser', () => {
    it('should update a user with the given data', async () => {
      // Arrange
      const mockUpdatedUser = {
        id: 1,
        email: 'updated@example.com',
        name: 'Updated User',
        password: 'hashed_password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await userService.updateUser(1, {
        email: 'updated@example.com',
        name: 'Updated User',
      });

      // Assert
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          email: 'updated@example.com',
          name: 'Updated User',
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      expect(result).toEqual(mockUpdatedUser);
    });

    it('should hash password when updating password', async () => {
      // Arrange
      const mockUpdatedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_newpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Setup password hashing mock
      bcryptjsMock.hash.mockReturnValueOnce('hashed_newpassword');
      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await userService.updateUser(1, { password: 'newpassword' });

      // Assert
      expect(bcryptjsMock.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'hashed_newpassword' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      // Arrange
      const mockDeletedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.user.delete.mockResolvedValue(mockDeletedUser);

      // Act
      const result = await userService.deleteUser(1);

      // Assert
      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(mockDeletedUser);
    });
  });
});
