import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { config } from '../../config';
import { DB } from '../types/generated-types';



// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create Kysely instance
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});



// Graceful shutdown function
export async function closeDatabase(): Promise<void> {
  try {
    await db.destroy();
    await pool.end();
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}