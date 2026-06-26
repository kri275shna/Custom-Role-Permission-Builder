import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './api/routes';
import { loggerMiddleware } from './api/middleware/logger.middleware';
import { errorHandlerMiddleware } from './api/middleware/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for local dev environment
app.use(
  cors({
    origin: '*', // Allow all origins for prototype purposes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
app.use(loggerMiddleware);

// API Routes
app.use('/api', apiRouter);

// Base Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Unknown Routes Fallback
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandlerMiddleware);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`[SYSTEM] Workbench RBAC Backend running on http://localhost:${PORT}`);
});

export { app, server };
export default app;
