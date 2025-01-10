// $lib/db.ts
import pkg from 'pg';
import { env } from '$env/dynamic/private';

const { Pool } = pkg;


// if (!env.DATABASE_URL) {
// 	throw new Error('DB environment variable DATABASE_URL must be set');
// }

export const pool = new Pool({
	connectionString: env.DATABASE_URL
});
