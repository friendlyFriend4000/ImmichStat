import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export async function GET() {
	try {
		const client = await pool.connect();

		// Generate a series of timestamps for the last 24 hours
		const generateTimestampsQuery = `
            SELECT generate_series(
                DATE_TRUNC('hour', NOW() - INTERVAL '1 day'),
                DATE_TRUNC('hour', NOW()),
                '1 minute'::interval
            ) AS hour_timestamp`;

		const timestampsResult = await client.query(generateTimestampsQuery);
		const allTimestamps = timestampsResult.rows.map((row) => row.hour_timestamp.getTime()); // Convert to milliseconds

		// Fetch the actual data grouped by ownerId and hour
		const dataQuery = `
            SELECT
                "ownerId",
                DATE_TRUNC('minute', "fileCreatedAt") AS hour_timestamp,
                COUNT(*) AS file_count
            FROM "assets"
            WHERE "fileCreatedAt" >= NOW() - INTERVAL '1 day'
            GROUP BY "ownerId", DATE_TRUNC('minute', "fileCreatedAt")
            ORDER BY "ownerId", hour_timestamp`;

		const dataResult = await client.query(dataQuery);
		client.release();

		// Group data by ownerId
		const groupedData = dataResult.rows.reduce((acc, row) => {
			const ownerId = row.ownerId;
			const timestamp = new Date(row.hour_timestamp).getTime(); // Convert to milliseconds
			const count = parseInt(row.file_count);

			if (!acc[ownerId]) {
				acc[ownerId] = {};
			}

			acc[ownerId][timestamp] = count;
			return acc;
		}, {});

		// Create the final output
		const formattedData = Object.keys(groupedData).map((ownerId) => {
			const countsMap = groupedData[ownerId];
			let cumulativeCount = 0;

			const timestamps = [];
			const counts = [];

			allTimestamps.forEach((timestamp) => {
				timestamps.push(timestamp);
				if (countsMap[timestamp] !== undefined) {
					cumulativeCount += countsMap[timestamp];
				}
				counts.push(cumulativeCount);
			});

			return {
				ownerId,
				timestamps,
				counts
			};
		});

		return json({ body: formattedData });
	} catch (err) {
		console.error(err);
		return json(
			{ error: err instanceof Error ? err.message : 'Internal server error' },
			{ status: 500 }
		);
	}
}
