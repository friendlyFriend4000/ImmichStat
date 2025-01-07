import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT COUNT(*) FROM "assets" WHERE "createdAt" >= NOW() - INTERVAL '1 months'`);
        client.release();

        return json({ body: result.rows });
    } catch (err) {
        console.error(err);
        return json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}