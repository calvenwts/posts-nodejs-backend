import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { validatePostInput } from '../middleware/validation';
import { PostService } from '../services/postService';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const postController = new PostController(new PostService());

// All post routes are protected
router.use(authenticateToken);

// Create a new post
router.post('/', validatePostInput, postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get post by id
router.get('/:id', postController.getPostById);

// Update post
router.put('/:id', validatePostInput, postController.updatePost);

// Delete post
router.delete('/:id', postController.deletePost);

export default router;
