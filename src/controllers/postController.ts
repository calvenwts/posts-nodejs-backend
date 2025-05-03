import { Request, Response } from 'express';
import { PostService } from '../services/postService';

const postService = new PostService();

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export class PostController {
  createPost: AsyncRequestHandler = async (req, res) => {
    try {
      const { title, content, authorId } = req.body;
      const post = await postService.createPost(title, content, authorId);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create post' });
    }
  };

  getPostById: AsyncRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(Number(id));
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get post' });
    }
  };

  getAllPosts: AsyncRequestHandler = async (req, res) => {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get posts' });
    }
  };

  updatePost: AsyncRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body;
      const post = await postService.updatePost(Number(id), {
        title,
        content,
        published,
      });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update post' });
    }
  };

  deletePost: AsyncRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await postService.deletePost(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete post' });
    }
  };
}
