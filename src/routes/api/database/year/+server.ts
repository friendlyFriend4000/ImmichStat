import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export async function GET() {
	try {
		const client = await pool.connect();
		const query = `
            WITH weekly_counts AS (
                SELECT
                    "ownerId",
                    date_trunc('week', "fileCreatedAt"::timestamp) as timestamp,
                    COUNT(*) as weekly_count
                FROM "assets"
                WHERE
                    EXTRACT(YEAR FROM "fileCreatedAt") != 1970
                  AND "fileCreatedAt" >= NOW() - INTERVAL '1 years'
                GROUP BY "ownerId", date_trunc('week', "fileCreatedAt"::timestamp)
            ),
                 cumulative_counts AS (
                     SELECT
                         wc."ownerId",
                         wc.timestamp,
                         SUM(wc.weekly_count) OVER (
                             PARTITION BY wc."ownerId"
                             ORDER BY wc.timestamp
                             ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                             ) as cumulative_count
                     FROM weekly_counts wc
                 )
            SELECT * FROM cumulative_counts
            ORDER BY timestamp DESC, "ownerId"`;

		const result = await client.query(query);
		client.release();

		const ownerStats = result.rows.reduce((acc, row) => {
			const { ownerId, timestamp, cumulative_count } = row;
			if (!acc[ownerId]) {
				acc[ownerId] = {
					ownerId,
					timestamps: [],
					counts: []
				};
			}
			const timestampMs = new Date(timestamp).setUTCHours(0, 0, 0, 0);
			acc[ownerId].timestamps.push(timestampMs);
			acc[ownerId].counts.push(parseInt(cumulative_count));
			return acc;
		}, {});

		return json({
			body: Object.values(ownerStats).map((owner) => {
				const combined = owner.timestamps.map((timestamp, index) => ({
					timestamp,
					count: owner.counts[index]
				}));
				combined.sort((a, b) => a.timestamp - b.timestamp);
				return {
					ownerId: owner.ownerId,
					timestamps: combined.map((item) => item.timestamp),
					counts: combined.map((item) => item.count)
				};
			})
		});
	} catch (err) {
		console.error(err);
		return json(
			{ error: err instanceof Error ? err.message : 'Internal server error' },
			{ status: 500 }
		);
	}
}
