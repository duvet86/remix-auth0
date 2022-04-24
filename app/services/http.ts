const BASE_URL = "https://api.mining.dev.imdexhub.com";

export async function httpGetAsync(url: string) {
  return await handleJSONResponeAsync(await handleFetch(url));
}

async function handleFetch(url: string) {
  const headers = new Headers();
  headers.append(
    "Ocp-Apim-Subscription-Key",
    "2700f59e45844d5c9a22c786edf733bb"
  );
  // headers.append("Authorization", `token ${token}`);

  return await fetch(BASE_URL + url, {
    headers,
  });
}

async function handleJSONResponeAsync(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      //   const body = await response.text();

      throw response;
    }
    throw new Error(response.statusText);
  }

  return await response.json();
}
