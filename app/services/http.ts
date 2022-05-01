import { sessionTokenKey } from "./authorize";
import { getSession } from "./session";

const BASE_URL = "https://api.mining.dev.imdexhub.com";

export async function httpGetAsync<T>(
  request: Request,
  url: string,
  queryStringParams = new URLSearchParams()
): Promise<T> {
  return await handleJSONResponeAsync(
    await handleFetch(request, url, queryStringParams)
  );
}

async function handleFetch(
  request: Request,
  urlString: string,
  queryStringParams: URLSearchParams
) {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get(sessionTokenKey);

  const headers = new Headers();
  headers.append(
    "Ocp-Apim-Subscription-Key",
    "2700f59e45844d5c9a22c786edf733bb"
  );
  headers.append("Authorization", `token ${accessToken}`);

  const url = new URL(BASE_URL + urlString);
  url.search = queryStringParams.toString();

  return await fetch(url.toString(), {
    headers,
  });
}

async function handleJSONResponeAsync(response: Response) {
  if (!response.ok) {
    throw response;
  }

  return await response.json();
}
