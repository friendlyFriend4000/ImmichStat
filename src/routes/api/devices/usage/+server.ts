import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		const query = sql`
            SELECT
                u.name as user_name,
                ae.make,
                ae.model,
                MIN(a."fileCreatedAt") as start_date,
                MAX(a."fileCreatedAt") as end_date,
                COUNT(a.id) as asset_count
            FROM asset a
            JOIN asset_exif ae ON a.id = ae."assetId"
            JOIN "user" u ON a."ownerId" = u.id
            WHERE ae.make IS NOT NULL 
              AND ae.model IS NOT NULL
              AND ae.make != ''
              AND ae.model != ''
            GROUP BY 
                u.name,
                ae.make, 
                ae.model
            ORDER BY 
                u.name,
                start_date ASC
        `;

		const result = await db.execute(query);

		return json(result.map((row) => ({
			userName: row.user_name as string,
			make: row.make as string,
			model: row.model as string,
			start: row.start_date as string,
			end: row.end_date as string,
			count: Number(row.asset_count)
		})));
	} catch (err) {
		console.error('Error fetching device usage history:', err);
		return json(
			{ error: err instanceof Error ? err.message : 'Internal server error' },
			{ status: 500 }
		);
	}
}
