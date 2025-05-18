import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserInput } from '../middleware/validation';
import { UserService } from '../services/userService';

const router = Router();
const userController = new UserController(new UserService());

// Create a new user
router.post('/', validateUserInput, userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by id
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', validateUserInput, userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

export default router;
