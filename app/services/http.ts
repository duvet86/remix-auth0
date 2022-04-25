import { sessionTokenKey } from "./authorize";
import { getSession } from "./session";

const BASE_URL = "https://api.mining.dev.imdexhub.com";

export async function httpGetAsync(request: Request, url: string) {
  return await handleJSONResponeAsync(await handleFetch(request, url));
}

async function handleFetch(request: Request, url: string) {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get(sessionTokenKey);

  const headers = new Headers();
  headers.append(
    "Ocp-Apim-Subscription-Key",
    "2700f59e45844d5c9a22c786edf733bb"
  );
  headers.append("Authorization", `token ${accessToken}`);

  return await fetch(BASE_URL + url, {
    headers,
  });
}

async function handleJSONResponeAsync(response: Response) {
  if (!response.ok) {
    throw response;
  }

  return await response.json();
}
