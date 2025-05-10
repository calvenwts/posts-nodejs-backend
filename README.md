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

### Running with Kubernetes (Minikube)

1. Start Minikube:

   ```bash
   minikube start
   ```

2. Set up Docker to use Minikube's Docker environment:

   ```bash
   eval $(minikube -p minikube docker-env)
   ```

3. Build the Docker image:

   ```bash
   docker build -t posts-nodejs-backend .
   ```

4. Create the required Kubernetes secret for PostgreSQL:

   ```bash
   kubectl create secret generic postgres-secret \
     --from-literal=POSTGRES_USER=postgres \
     --from-literal=POSTGRES_PASSWORD=postgres \
     --from-literal=POSTGRES_DB=posts_db_development
   ```

5. Apply Kubernetes manifests for Postgres and the Node.js API:

   ```bash
   kubectl apply -f k8s/postgres-deployment.yaml
   kubectl apply -f k8s/api-deployment.yaml
   ```

6. Run Prisma migration as a Kubernetes Job:

   ```bash
   kubectl apply -f k8s/prisma-migrate-job.yaml
   kubectl wait --for=condition=complete job/prisma-migrate
   ```

7. Port-forward the API service to localhost:

   ```bash
   kubectl port-forward svc/posts-nodejs-backend 3000:3000
   ```

8. Test the API using curl:
   ```bash
   curl http://localhost:3000/api/users
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
