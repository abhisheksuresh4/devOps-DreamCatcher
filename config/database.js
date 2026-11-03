import pg from 'pg';

const { Pool } = pg;

// Each environment (production, staging) gets its own schema in the same
// Postgres database, so their data never mixes.
const schema = process.env.DB_SCHEMA || 'public';
if (!/^[a-z_][a-z0-9_]*$/.test(schema)) {
  throw new Error(`Invalid DB_SCHEMA "${schema}": use lowercase letters, digits and underscores`);
}

let pool = null;

export function getSchema() {
  return schema;
}

export function getDatabase() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    // Render's internal URLs (dpg-xxx-a) are plain TCP inside the private
    // network; external URLs (*.render.com) and most hosted Postgres need TLS.
    const needsSsl =
      process.env.DATABASE_SSL === 'true' ||
      (process.env.DATABASE_SSL !== 'false' && /\.render\.com/.test(connectionString));

    pool = new Pool({
      connectionString,
      ssl: needsSsl ? { rejectUnauthorized: false } : false,
      options: `-c search_path=${schema}`,
      max: 5
    });

    pool.on('error', (error) => {
      console.error('Unexpected Postgres pool error:', error);
    });
  }
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default { getDatabase, closeDatabase, getSchema };
