import { init } from '@immich/sdk';
import { IMMICH_URL, IMMICH_API_KEY } from '$env/static/private';

init({
	baseUrl: IMMICH_URL,
	apiKey: IMMICH_API_KEY
});

export * from '@immich/sdk';
