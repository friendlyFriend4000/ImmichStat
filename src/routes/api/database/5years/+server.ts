import { get5YearsStats } from '$lib/server/db/5years/+server';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		const stats = await get5YearsStats();
		return json(stats);
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Failed to fetch 5 years stats' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
