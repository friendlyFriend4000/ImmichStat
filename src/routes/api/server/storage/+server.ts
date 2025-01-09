import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function GET() {
	const IMMICH_API_KEY = env.IMMICH_API_KEY;
	const IMMICH_URL = env.IMMICH_URL;

	// Add validation to ensure environment variables are present
	if (!IMMICH_API_KEY || !IMMICH_URL) {
		throw new Error('Required environment variables IMMICH_API_KEY and IMMICH_URL must be set');
	}

	let response = {};

	try {
		const res = await fetch(IMMICH_URL + '/api/server/storage/', {
			headers: {
				Accept: 'application/json',
				'x-api-key': IMMICH_API_KEY
			}
		});
		response = await res.json();
	} catch (err) {
		console.error(err);
	}
	return json(response, { status: 200 });
}
