import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE "fileCreatedAt" >= NOW() - INTERVAL '1 day') as last_day,
                COUNT(*) FILTER (WHERE "fileCreatedAt" >= NOW() - INTERVAL '1 week') as last_7_days,
                COUNT(*) FILTER (WHERE "fileCreatedAt" >= NOW() - INTERVAL '1 month') as last_30_days,
                COUNT(*) FILTER (WHERE "fileCreatedAt" >= NOW() - INTERVAL '1 year') as last_365_days,
                COUNT(*) as total
            FROM "assets"`;

        const result = await client.query(query);
        client.release();

        // Transform the result into a more structured format
        const counts = {
            day: parseInt(result.rows[0].last_day),
            last_7_days: parseInt(result.rows[0].last_7_days),
            last_30_days: parseInt(result.rows[0].last_30_days),
            last_365_days: parseInt(result.rows[0].last_365_days),
            total: parseInt(result.rows[0].total)
        };

        return json({ body: counts });
    } catch (err) {
        console.error(err);
        return json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}