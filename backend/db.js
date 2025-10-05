import pkg from 'pg';
import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(`📦 Connected to database: ${process.env.DATABASE_URL}`);
