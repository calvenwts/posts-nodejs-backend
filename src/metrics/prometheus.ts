import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});
register.registerMetric(httpRequestCounter);

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

const inFlightRequests = new client.Gauge({
  name: 'http_requests_in_flight',
  help: 'Number of in-flight requests being processed',
});
register.registerMetric(inFlightRequests);

const errorCounter = new client.Counter({
  name: 'http_requests_errors_total',
  help: 'Total number of HTTP error responses',
  labelNames: ['method', 'path', 'status'],
});
register.registerMetric(errorCounter);

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    path: req.path,
  });

  inFlightRequests.inc();

  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      path: req.route?.path || req.path,
      status: res.statusCode.toString(),
    });

    if (res.statusCode >= 400) {
      errorCounter.inc({
        method: req.method,
        path: req.route?.path || req.path,
        status: res.statusCode.toString(),
      });
    }

    end({ status: res.statusCode.toString() });
    inFlightRequests.dec();
  });

  next();
};

export const exposeMetricsRoute = (app: import('express').Express) => {
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  });
};
