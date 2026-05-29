import dotenv from 'dotenv';
dotenv.config();

function normalizeEnvUrl(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  return value.trim().replace(/^["']+|["']+$/g, '');
}

const FRONTEND_URL = normalizeEnvUrl(
  process.env.FRONTEND_URL,
  'http://localhost:3000'
);

export const ENV = {
  APP_NAME: process.env.APP_NAME || 'RecitReady',
  PORT: parseInt(process.env.PORT || '8000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_me',
  FRONTEND_URL,
  BACKEND_URL: normalizeEnvUrl(process.env.BACKEND_URL, 'http://localhost:8000'),
  // Accept either GEMINI_API_KEY or GEMINI_KEY (your .env uses GEMINI_KEY)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || "",
  
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASSWORD,
    FROM: process.env.SMTP_FROM,
  }
};