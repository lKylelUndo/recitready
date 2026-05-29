import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from '@/config/env';
import routes from '@/routes';

const app = express();

// --- Core Middleware ---
const allowedOrigins = new Set(
  [ENV.FRONTEND_URL, 'http://localhost:3000'].map((url) => url.replace(/\/$/, ''))
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = origin.replace(/\/$/, '');
      if (allowedOrigins.has(normalized)) {
        callback(null, normalized);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Simple Health Check ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: `${ENV.APP_NAME} instance is healthy`,
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV
  });
});

// --- Routes Folder Prepared ---
app.use('/api', routes);

// --- 404 Handler ---
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// --- Global Error Handler ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Global Error Hook:', err.message);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    message: ENV.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    ...(ENV.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

export default app;