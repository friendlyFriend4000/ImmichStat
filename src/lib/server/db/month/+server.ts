import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export async function getMonthStats() {
	try {
		// Generate a series of timestamps for the last 30 days
		const generateTimestampsQuery = sql`
		          SELECT generate_series(
		              DATE_TRUNC('day', NOW() - INTERVAL '30 day'),
		              DATE_TRUNC('day', NOW()),
		              INTERVAL '1 day'
		          ) AS day_timestamp`;

		const timestampsResult = await db.execute(generateTimestampsQuery);
		const allTimestamps = timestampsResult.map((row) =>
			new Date(row.day_timestamp as string).getTime()
		);

		// Fetch the actual data grouped by ownerId and day
		const dataQuery = sql`
            SELECT
                "ownerId",
                DATE_TRUNC('day', "fileCreatedAt") AS day_timestamp,
                COUNT(*) AS file_count
            FROM "asset"
            WHERE "fileCreatedAt" >= NOW() - INTERVAL '30 day'
            GROUP BY "ownerId", DATE_TRUNC('day', "fileCreatedAt")
            ORDER BY "ownerId", day_timestamp`;

		const dataResult = await db.execute(dataQuery);

		// Group data by ownerId
		const groupedData: Record<string, Record<number, number>> = {};

		for (const row of dataResult) {
			const ownerId = row.ownerId as string;
			const timestamp = new Date(row.day_timestamp as string).getTime();
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
