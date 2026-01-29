import pkg from "pg";
const { Pool } = pkg;

// Prevent multiple pools in development (Hot Reload fix)
let pool: pkg.Pool;

if (!global.postgresPool) {
  global.postgresPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Limit connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}
pool = global.postgresPool;

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;

// Add type definition for global
declare global {
  var postgresPool: pkg.Pool | undefined;
}
