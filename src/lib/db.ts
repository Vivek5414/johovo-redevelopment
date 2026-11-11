import 'server-only';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for upload metadata storage.');
}

export const sql = neon(databaseUrl);
