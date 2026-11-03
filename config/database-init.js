import { getDatabase, getSchema } from './database.js';

// Create the schema and dreams table if they don't exist
export async function initDatabase() {
  try {
    const db = getDatabase();
    await db.query(`CREATE SCHEMA IF NOT EXISTS ${getSchema()}`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS dreams (
        id SERIAL PRIMARY KEY,
        dream_text TEXT NOT NULL,
        interpretation TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
