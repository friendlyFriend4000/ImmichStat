import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export async function getTotalVideoDuration() {
	try {
		// Calculate total duration in seconds
		// We cast to interval. We assume duration is stored as 'HH:MM:SS' or similar which is standard for Immich/Postgres
		// We filter for standard format to avoid cast errors
		const query = sql`
            SELECT EXTRACT(EPOCH FROM SUM(duration::interval)) as total_seconds
            FROM asset
            WHERE type = 'VIDEO' 
            AND duration IS NOT NULL 
            AND duration ~ '^[0-9]{2}:[0-9]{2}:[0-9]{2}'
        `;
		const result = await db.execute(query);
		return Number(result[0]?.total_seconds || 0);
	} catch (err) {
		console.error('Error calculating total video duration:', err);
		return 0;
	}
}

export async function getYearlyActivityStats() {
	try {
		// Get activity for the last 365 days
		// Filter by assets that have an entry in asset_exif (implying camera taken)
		// We join with asset_exif and check for model
		// Group by user and date
		const query = sql`
            SELECT
                "ownerId",
                DATE("localDateTime")::text as date,
                COUNT(*)::int as count
            FROM asset
            JOIN asset_exif ON asset.id = asset_exif."assetId"
            WHERE "localDateTime" >= NOW() - INTERVAL '1 year'
            AND asset_exif.model IS NOT NULL
            AND asset_exif.model != ''
            GROUP BY 1, 2
            ORDER BY 2
        `;
		const result = await db.execute(query);
		return result as unknown as { ownerId: string; date: string; count: number }[];
	} catch (err) {
		console.error('Error calculating yearly activity stats:', err);
		return [];
	}
}

export async function getTotalAlbums() {
	try {
		const query = sql`
	           SELECT COUNT(*)::int as total_albums
	           FROM album
	           WHERE "deletedAt" IS NULL
	       `;
		const result = await db.execute(query);
		return Number(result[0]?.total_albums || 0);
	} catch (err) {
		console.error('Error calculating total albums:', err);
		return 0;
	}
}
