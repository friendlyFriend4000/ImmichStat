import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const query = `
            SELECT
                DATE_TRUNC('week', "fileCreatedAt") as week,
                COUNT(*) as count
            FROM "assets"
            WHERE "fileCreatedAt" >= NOW() - INTERVAL '1 year'
            GROUP BY DATE_TRUNC('week', "fileCreatedAt")
            ORDER BY week DESC`;

        const result = await client.query(query);
        client.release();

        // Transform the result into an array of week counts
        const weeklyData = result.rows.map(row => ({
            week: row.week,
            count: parseInt(row.count)
        }));

        return json({ body: weeklyData });
    } catch (err) {
        console.error(err);
        return json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}