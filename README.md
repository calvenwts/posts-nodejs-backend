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

### Monitoring with Prometheus and Grafana

9. Install Prometheus and Grafana via Helm:

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   helm install kube-monitor prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
   ```

10. Verify the pods are running:

```bash
kubectl get pods -n monitoring
```

11. Port-forward Prometheus:

```bash
kubectl port-forward -n monitoring svc/kube-monitor-kube-promethe-prometheus 9090
```

Access Prometheus at: http://localhost:9090

12. Port-forward Grafana:

```bash
kubectl port-forward -n monitoring svc/kube-monitor-grafana 3001:80
```

Access Grafana at: http://localhost:3001

Default login:

- Username: `admin`
- Password: `prom-operator` or check with:

  ```bash
  kubectl get secret -n monitoring kube-monitor-grafana -o jsonpath="{.data.admin-password}" | base64 --decode; echo
  ```

13. View your application's metrics by navigating to Prometheus > Targets and searching for `posts-api-monitor`.

14. Create dashboards in Grafana using metrics like `http_requests_total`, `http_request_duration_seconds`, and `http_requests_errors_total`.

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
