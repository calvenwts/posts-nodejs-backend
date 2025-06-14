import { Request, Response } from 'express';
import { UserService } from '../services/userService';

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  createUser: AsyncRequestHandler = async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const user = await this.userService.createUser(email, name, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create user' });
    }
  };

  getUserById: AsyncRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(Number(id));
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get user' });
    }
  };

  getAllUsers: AsyncRequestHandler = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get users' });
    }
  };

  updateUser: AsyncRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { email, name, password } = req.body;
      const user = await this.userService.updateUser(Number(id), {
        email,
        name,
        password,
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update user' });
    }
  };

  deleteUser: AsyncRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete user' });
    }
  };

  login: AsyncRequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      res.status(400).json({ error: 'Failed to login' });
    }
  };
}
