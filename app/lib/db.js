import { createPool } from '@vercel/postgres';

export async function connectToDatabase() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL
  });
  return pool;
}
