# Posts Node.js Backend

A Node.js backend API for managing posts and users.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Start PostgreSQL and ensure it's running on port 5432

5. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts

- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
