import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import prisma from './lib/prisma';
import { logger } from './lib/logger';
import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import quizRoutes from './routes/quiz';
import certificateRoutes from './routes/certificate';
import paymentRoutes from './routes/payment';
import practiceRoutes from './routes/practice';
import forumRoutes from './routes/forum';

dotenv.config();

if (!process.env.JWT_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

if (!process.env.PAYMENT_WEBHOOK_SECRET) {
  logger.error("FATAL ERROR: PAYMENT_WEBHOOK_SECRET environment variable is not defined.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

const allowedOrigin = process.env.CORS_ORIGIN || 'https://edunexus.kibm.in';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Restrict incoming payload sizes to prevent heap-exhaustion DoS (Issue #7)
app.use(express.json({ limit: '10kb' }));

// Global CSRF Protection Check for all state-modifying requests (Issue #11)
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    const csrfHeader = req.headers['x-requested-with'];
    if (!csrfHeader || csrfHeader !== 'XMLHttpRequest') {
      logger.error(`Security Check: CSRF request validation failed (missing or invalid header) for ${req.method} ${req.path}`);
      return res.status(403).json({ message: 'CSRF Protection Check: Invalid request signature.' });
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/forum', forumRoutes);

// Health Check Instrumentation Endpoint (Issue #8)
app.get('/health', async (req, res) => {
  try {
    // Assert active database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    logger.error('Health check database connection failure:', err);
    res.status(500).json({
      status: 'ERROR',
      database: 'DISCONNECTED',
      error: err.message || String(err)
    });
  }
});

app.get('/', (req, res) => {
  res.send('Summer Training Portal API is running');
});

const server = app.listen(PORT, () => {
  logger.info(`Server successfully started and listening on port ${PORT}`);
});

// Graceful Connection Teardown Handler (Issue #9)
const gracefulShutdown = async (signal: string) => {
  logger.info(`Process received ${signal} signal. Starting graceful teardown...`);
  
  server.close(async () => {
    logger.info('Express server closed successfully.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database client disconnected cleanly.');
      process.exit(0);
    } catch (err) {
      logger.error('Failed to cleanly disconnect Prisma client during exit:', err);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded. Forcing immediate exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { app };
