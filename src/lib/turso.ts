'use server';
import { createClient } from '@libsql/client';

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined in .env file');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  // Auth token is optional for local development, but required for production.
  // We'll log a warning if it's not present.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('TURSO_AUTH_TOKEN is not defined in .env file for production');
  } else {
    console.warn('TURSO_AUTH_TOKEN is not defined. This is okay for local development, but required for production.');
  }
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
