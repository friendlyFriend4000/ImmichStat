import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export async function GET() {
	try {
		const client = await pool.connect();

		// Generate a series of timestamps for the last 30 days
		const generateTimestampsQuery = `
            SELECT generate_series(
                DATE_TRUNC('day', NOW() - INTERVAL '30 days'),
                DATE_TRUNC('day', NOW()),
                '1 day'::interval
            ) AS day_timestamp`;

		const timestampsResult = await client.query(generateTimestampsQuery);
		const allTimestamps = timestampsResult.rows.map((row) => row.day_timestamp.getTime()); // Convert to milliseconds

		// Fetch the actual data grouped by ownerId and day
		const dataQuery = `
            SELECT
                "ownerId",
                DATE_TRUNC('day', "fileCreatedAt") AS day_timestamp,
                COUNT(*) AS file_count
            FROM "assets"
            WHERE "fileCreatedAt" >= NOW() - INTERVAL '30 days'
            GROUP BY "ownerId", DATE_TRUNC('day', "fileCreatedAt")
            ORDER BY "ownerId", day_timestamp`;

		const dataResult = await client.query(dataQuery);
		client.release();

		// Group data by ownerId
		const groupedData = dataResult.rows.reduce((acc, row) => {
			const ownerId = row.ownerId;
			const timestamp = new Date(row.day_timestamp).getTime(); // Convert to milliseconds
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
