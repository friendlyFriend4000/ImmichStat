import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export async function getDeviceHistory() {
	try {
		// Group by make, model and month to get usage periods
		// We use COALESCE on make/model to ensure we don't group nulls unexpectedly, though the WHERE clause handles it.
		// We prioritize asset_exif data but could fallback to other fields if needed.
		const query = sql`
            SELECT
                ae.make,
                ae.model,
                DATE_TRUNC('month', a."fileCreatedAt") as month_start,
                MIN(a."fileCreatedAt") as start_date,
                MAX(a."fileCreatedAt") as end_date,
                COUNT(*) as asset_count
            FROM asset a
            JOIN asset_exif ae ON a.id = ae."assetId"
            WHERE ae.make IS NOT NULL 
              AND ae.model IS NOT NULL
              AND ae.make != ''
              AND ae.model != ''
            GROUP BY 
                ae.make, 
                ae.model, 
                DATE_TRUNC('month', a."fileCreatedAt")
            ORDER BY 
                start_date ASC
        `;

		const result = await db.execute(query);

		return result.map((row) => ({
			make: row.make as string,
			model: row.model as string,
			monthStart: new Date(row.month_start as string),
			start: new Date(row.start_date as string),
			end: new Date(row.end_date as string),
			count: Number(row.asset_count)
		}));
	} catch (err) {
		console.error('Error fetching device history:', err);
		throw err;
	}
}
