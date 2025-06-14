import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserInput } from '../middleware/validation';
import { UserService } from '../services/userService';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const userController = new UserController(new UserService());

// Public routes
router.post('/', validateUserInput, userController.createUser);
router.post('/login', userController.login);

// Protected routes
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/', authenticateToken, userController.getAllUsers);
router.put('/:id', authenticateToken, validateUserInput, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

export default router;
