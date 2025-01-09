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
            WHERE EXTRACT(YEAR FROM "fileCreatedAt") != 1970
            GROUP BY "ownerId", date_trunc('week', "fileCreatedAt"::timestamp)
                ),
                cumulative_counts AS (
            SELECT
                "ownerId",
                timestamp,
                SUM(weekly_count) OVER (
                PARTITION BY "ownerId"
                ORDER BY timestamp
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) as cumulative_count
            FROM weekly_counts
                )
            SELECT * FROM cumulative_counts
            ORDER BY timestamp DESC, "ownerId"`;

        const result = await client.query(query);
        client.release();

        // Transform the result into a more structured format
        const ownerStats = result.rows.reduce((acc, row) => {
            const { ownerId, timestamp, cumulative_count } = row;
            if (!acc[ownerId]) {
                acc[ownerId] = {
                    ownerId,
                    timestamps: [],
                    counts: []
                };
            }
            // Convert to beginning of week Unix timestamp (milliseconds)
            const timestampMs = new Date(timestamp).setUTCHours(0, 0, 0, 0);
            acc[ownerId].timestamps.push(timestampMs);
            acc[ownerId].counts.push(parseInt(cumulative_count));
            return acc;
        }, {});

        return json({
            body: Object.values(ownerStats).map(owner => {
                // Combine the timestamps and counts into a single array of objects
                const combined = owner.timestamps.map((timestamp, index) => ({
                    timestamp,
                    count: owner.counts[index]
                }));
                // Sort by timestamp in ascending order
                combined.sort((a, b) => a.timestamp - b.timestamp);
                // Separate the sorted timestamps and counts again
                return {
                    ownerId: owner.ownerId,
                    timestamps: combined.map(item => item.timestamp),
                    counts: combined.map(item => item.count)
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