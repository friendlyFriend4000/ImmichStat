import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export async function GET() {
	try {
		const users = await db.select({
			id: user.id,
			name: user.name,
			email: user.email
		}).from(user);

		return json(users);
	} catch (err) {
		console.error(err);
		return json(
			{ error: err instanceof Error ? err.message : 'Internal server error' },
			{ status: 500 }
		);
	}
}
