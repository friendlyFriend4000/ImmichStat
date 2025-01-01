import { IMMICH_API_KEY, IMMICH_URL } from '$env/static/private';


export async function GET() {
  let response = {};
  const options: ResponseInit = {
    status: 200,
  }
  try {
    const res = await fetch(IMMICH_URL + "/api/server/statistics/", {
      headers: {
        'Accept': 'application/json',
        'x-api-key': IMMICH_API_KEY
      }
    });
    response = await res.json();

  } catch (err) {
    console.error(err);
  }

 return new Response(JSON.stringify(response), options)
}
