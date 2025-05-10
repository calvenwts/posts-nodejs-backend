import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import client from 'prom-client';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './lib/logger';
import { exposeMetricsRoute, metricsMiddleware } from './metrics/prometheus';

dotenv.config();

const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Middleware
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Metrics route
exposeMetricsRoute(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
