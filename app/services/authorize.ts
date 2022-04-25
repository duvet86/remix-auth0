import type { Session } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";

import { AuthorizationError } from "./authorization-error";
import { commitSession, destroySession, getSession } from "./session";

invariant(process.env.AUTH_DOMAIN);
invariant(process.env.AUTH_CLIENT_ID);
invariant(process.env.AUTH_CLIENT_SECRET);
invariant(process.env.AUTH_CALLBACK_URL);

const auth0 = {
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  domain: process.env.AUTH_DOMAIN,
  callbackUrl: process.env.AUTH_CALLBACK_URL,
};

const sessionStateKey = "oauth2:state";
const sessionKey = "user";
export const sessionTokenKey = "token";
const userInfoURL = `https://${auth0.domain}/userinfo`;
const scope = "openid profile email";
const authorizationURL = `https://${auth0.domain}/authorize`;
const tokenURL = `https://${auth0.domain}/oauth/token`;
const logoutURL = `https://${auth0.domain}/v2/logout`;

type ExtraParams = Record<string, unknown>;

export interface Auth0Options {
  domain: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: string;
}

export interface Auth0ExtraParams extends Record<string, string | number> {
  id_token: string;
  scope: string;
  expires_in: 86_400;
  token_type: "Bearer";
}

export interface OAuth2Profile {
  provider: string;
  id?: string;
  displayName?: string;
  name?: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  emails?: Array<{
    value: string;
    type?: string;
  }>;
  photos?: Array<{ value: string }>;
}

export interface Auth0Profile extends OAuth2Profile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
    middleName: string;
  };
  emails: [{ value: string }];
  photos: [{ value: string }];
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    middle_name: string;
    nickname: string;
    preferred_username: string;
    profile: string;
    picture: string;
    website: string;
    email: string;
    email_verified: boolean;
    gender: string;
    birthdate: string;
    zoneinfo: string;
    locale: string;
    phone_number: string;
    phone_number_verified: boolean;
    address: {
      country: string;
    };
    updated_at: string;
  };
}

export const logout = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const cookie = await destroySession(session);

  const url = new URL(logoutURL);
  const params = new URLSearchParams();
  params.set("client_id", auth0.clientId);
  params.set("returnTo", "http://localhost:4200");

  url.search = params.toString();

  return redirect(url.toString(), { headers: { "Set-Cookie": cookie } });
};

export const authorize = async (
  request: Request,
  callback: (user: Auth0Profile) => Promise<Response>
) => {
  const session = await getSession(request.headers.get("Cookie"));

  let user: Auth0Profile | null = session.get(sessionKey) ?? null;

  if (user !== null) {
    return await callback(user);
  }

  const url = new URL(request.url);
  const callbackURL = getCallbackURL(auth0.callbackUrl, url);

  const state = url.searchParams.get("state");

  if (state === null) {
    return await authorizeSession(session);
  }

  if (session.get(sessionStateKey) === state) {
    session.unset(sessionStateKey);
  } else {
    throw new AuthorizationError("State doesn't match.");
  }

  const code = url.searchParams.get("code");
  if (code === null) {
    throw new AuthorizationError("Missing code.");
  }

  const params = new URLSearchParams();
  params.set("grant_type", "authorization_code");
  params.set("redirect_uri", callbackURL.toString());

  const { accessToken } = await getAccessToken(code, params);

  user = await userProfile(accessToken);

  // Because a callback was not provided, we are going to store the user data
  // on the session and commit it as a cookie.
  session.set(sessionKey, user);
  session.set(sessionTokenKey, accessToken);

  const cookie = await commitSession(session);

  return redirect("/", { headers: { "Set-Cookie": cookie } });
};

function getCallbackURL(callbackURL: string, url: URL): URL {
  if (callbackURL.startsWith("http:") || callbackURL.startsWith("https:")) {
    return new URL(callbackURL);
  }
  if (callbackURL.startsWith("/")) {
    return new URL(callbackURL, url);
  }
  return new URL(`${url.protocol}//${callbackURL}`);
}

async function authorizeSession(session: Session): Promise<Response> {
  const state = encodeURIComponent(uuidv4());

  session.set(sessionStateKey, state);

  const cookie = await commitSession(session);

  const params = new URLSearchParams();
  params.set("response_type", "code");
  params.set("client_id", auth0.clientId);
  params.set("redirect_uri", auth0.callbackUrl);
  params.set("scope", scope);
  params.set("state", state);
  params.set("audience", "https://imt.api.dev.imdexlimited.com/");

  const url = new URL(authorizationURL);
  url.search = params.toString();

  return redirect(url.toString(), { headers: { "Set-Cookie": cookie } });
}

async function getAccessToken(
  code: string,
  params: URLSearchParams
): Promise<{
  accessToken: string;
  refreshToken: string;
  extraParams: ExtraParams;
}> {
  params.set("client_id", auth0.clientId);
  params.set("client_secret", auth0.clientSecret);

  if (params.get("grant_type") === "refresh_token") {
    params.set("refresh_token", code);
  } else {
    params.set("code", code);
  }

  const response = await fetch(tokenURL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    try {
      const body = await response.json();
      if (body?.error) {
        throw new AuthorizationError(body.error);
      }
      throw new AuthorizationError();
    } catch {
      throw new AuthorizationError();
    }
  }

  const { access_token, refresh_token, ...extraParams } = await response.json();

  return {
    accessToken: access_token as string,
    refreshToken: refresh_token as string,
    extraParams,
  } as const;
}

async function userProfile(accessToken: string): Promise<Auth0Profile> {
  const response = await fetch(userInfoURL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: Auth0Profile["_json"] = await response.json();

  const profile: Auth0Profile = {
    provider: "auth0",
    displayName: data.name,
    id: data.sub,
    name: {
      familyName: data.family_name,
      givenName: data.given_name,
      middleName: data.middle_name,
    },
    emails: [{ value: data.email }],
    photos: [{ value: data.picture }],
    _json: data,
  };

  return profile;
}
