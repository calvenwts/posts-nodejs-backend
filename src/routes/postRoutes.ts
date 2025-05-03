import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { validatePostInput } from '../middleware/validation';

const router = Router();
const postController = new PostController();

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
