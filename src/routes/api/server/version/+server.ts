import { IMMICH_URL } from '$env/static/private';

export async function GET() {
  let response = {};
  const options: ResponseInit = {
    status: 200,
  }
  try {
    // const res = await fetch("https://immich.site.com/api/server/version", {
    const res = await fetch(IMMICH_URL + "/api/server/version", {
      headers: {
        'Accept': 'application/json',
      }
    });
    response = await res.json();

  } catch (err) {
    console.error(err);
  }

 return new Response(JSON.stringify(response), options)
}



