import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export async function get5YearsStats() {
	try {
		// Generate a series of timestamps for the last 5 years, one per month
		const generateTimestampsQuery = sql`
		          SELECT generate_series(
		              DATE_TRUNC('month', NOW() - INTERVAL '5 year'),
		              DATE_TRUNC('month', NOW()),
		              INTERVAL '1 month'
		          ) AS month_timestamp`;

		const timestampsResult = await db.execute(generateTimestampsQuery);
		const allTimestamps = timestampsResult.map((row) =>
			new Date(row.month_timestamp as string).getTime()
		);

		// Fetch the actual data grouped by ownerId and month
		const dataQuery = sql`
		          SELECT
		              "ownerId",
		              DATE_TRUNC('month', "fileCreatedAt") AS month_timestamp,
		              COUNT(*) AS file_count
		          FROM "asset"
		          WHERE "fileCreatedAt" >= NOW() - INTERVAL '5 year'
		          GROUP BY "ownerId", DATE_TRUNC('month', "fileCreatedAt")
		          ORDER BY "ownerId", month_timestamp`;

		const dataResult = await db.execute(dataQuery);

		// Group data by ownerId
		const groupedData: Record<string, Record<number, number>> = {};

		// Initialize groupedData structure for better handling
		for (const row of dataResult) {
			const ownerId = row.ownerId as string;
			const timestamp = new Date(row.month_timestamp as string).getTime();
			const count = parseInt(row.file_count as string);

			if (!groupedData[ownerId]) {
				groupedData[ownerId] = {};
			}

			groupedData[ownerId][timestamp] = count;
		}

		// Create the final output
		const formattedData = Object.keys(groupedData).map((ownerId) => {
			const countsMap = groupedData[ownerId];
			let cumulativeCount = 0;

			const timestamps: number[] = [];
			const counts: number[] = [];

			allTimestamps.forEach((timestamp) => {
				timestamps.push(timestamp);
				// If we have data for this timestamp, add it to cumulative count
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

		return { body: formattedData };
	} catch (err) {
		console.error(err);
		throw err;
	}
}
