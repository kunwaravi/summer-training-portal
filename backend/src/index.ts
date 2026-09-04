// Import env FIRST so dotenv.config() runs before any other module reads
// process.env at import time (SECURITY #65 — required secrets must be present).
import './lib/env';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import prisma from './lib/prisma';
import { logger } from './lib/logger';
import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import quizRoutes from './routes/quiz';
import certificateRoutes from './routes/certificate';
import internshipRoutes from './routes/internships';
import paymentRoutes from './routes/payment';
import practiceRoutes from './routes/practice';
import forumRoutes from './routes/forum';
import assignmentRoutes from './routes/assignment';
import projectRoutes from './routes/project';
import contactRoutes from './routes/contact';
import challengeRoutes from './routes/challenge';
import sandboxRoutes from './routes/sandbox';
import { errorHandler } from './middleware/errorHandler';

// Required-secret validation now happens inside getRequiredEnv() at import time
// (src/lib/env.ts). These explicit guards remain as a clear, logged fatal stop
// in case a secret is removed from the environment after startup.
if (!process.env.JWT_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// CORS: accept a comma-separated list (CORS_ORIGIN="https://a.com,https://b.com").
// In development, localhost dev-server origins are added automatically so the
// browser can reach the API without the "blocked by CORS" failure on login.
const configuredOrigins = (process.env.CORS_ORIGIN || 'https://edunexus.kibm.in')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === 'development'
    ? [...configuredOrigins, 'http://localhost:5173', 'http://127.0.0.1:5173']
    : configuredOrigins;

app.use(cors({
  // Allow requests with no Origin header (curl, server-to-server, health checks).
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Restrict incoming payload sizes to prevent heap-exhaustion DoS.
// 1mb (was 10kb) — forum posts, quiz submissions, and assignment/project
// submissions legitimately exceed 10kb and were being rejected with a bare 413.
app.use(express.json({ limit: '1mb' }));

// NOTE: No global CSRF middleware. Auth is JWT Bearer via the Authorization
// header (not a browser-auto-sent cookie), so classic cross-site request
// forgery does not apply — a cookie is never present on the wire. The previous
// `x-requested-with: XMLHttpRequest` check was trivially forgeable by any
// page's fetch() and gave only false confidence, so it was removed.

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/sandbox', sandboxRoutes);

// Health Check Instrumentation Endpoint
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
  res.send('EduNexus Pro API is running');
});

// Centralized error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server successfully started and listening on port ${PORT}`);
});

// Graceful Connection Teardown Handler
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
