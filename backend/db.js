import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false, // בלוקאל לא נשתמש ב-SSL
});

console.log(`📦 Connected to database: ${process.env.DATABASE_URL}`);
