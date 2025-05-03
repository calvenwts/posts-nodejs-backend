import { Request, Response, NextFunction } from 'express';

export const validateUserInput = (req: Request, res: Response, next: NextFunction): void => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ error: 'Email, name, and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  next();
};

export const validatePostInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    res.status(400).json({ error: 'Title, content, and authorId are required' });
    return;
  }

  if (title.length < 3) {
    res.status(400).json({ error: 'Title must be at least 3 characters long' });
    return;
  }

  if (content.length < 10) {
    res.status(400).json({ error: 'Content must be at least 10 characters long' });
    return;
  }

  next();
};
