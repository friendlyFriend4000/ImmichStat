import { env } from '$env/dynamic/private';

export async function GET() {
  const IMMICH_URL = env.IMMICH_URL;

  // Add validation to ensure environment variables are present
  if (!IMMICH_URL) {
    throw new Error('Required environment variables IMMICH_API_KEY and IMMICH_URL must be set');
  }

  let response = {};
  const options: ResponseInit = {
    status: 200,
  }

  try {
    const res = await fetch(IMMICH_URL + "/api/server/version", {
      headers: {
        'Accept': 'application/json'
      }
    });
    response = await res.json();
  } catch (err) {
    console.error(err);
  }
  return new Response(JSON.stringify(response), options)
}


