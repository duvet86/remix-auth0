import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import NavigationHeader from "./components/navigation/navigation-header";
import { authorize } from "./services/authorize";
import { httpGetAsync } from "./services/http";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import styles from "./index.css";

import type { Site, UserAuthorisation } from "./types";

import emptyLogo from "./empty_state.svg";
import type { RootData } from "./utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: styles },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  return authorize(request, async (user) => {
    const userAuthorisation = user._json[
      "https://mining.imdexhub.com/permissions"
    ] as UserAuthorisation;

    const siteRoles = userAuthorisation.siteRoles;
    if (userAuthorisation == null || siteRoles.length === 0) {
      throw new Response("Unauthorized", { status: 401 });
    }

    if (new URL(request.url).pathname === "/") {
      return redirect(`/${siteRoles[0].siteId}`);
    }

    const sites = await httpGetAsync<Site[]>(request, "/imt-api/sites");

    const siteDictionary = sites.reduce<Record<string, Site>>((res, site) => {
      res[site.siteId] = site;

      return res;
    }, {});

    const userSites = userAuthorisation.siteRoles.map(
      ({ siteId }) => siteDictionary[siteId]
    );

    return json<RootData>({
      user,
      sites: userSites,
    });
  });
};

export default function App() {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <NavigationHeader />
        <main className="flex h-full w-full flex-col items-center">
          <h1 className="mt-8 mb-12 text-2xl">
            {caught.status} {caught.statusText}
          </h1>
          <img width="400" alt="empty state" src={emptyLogo} />
        </main>
        <Scripts />
      </body>
    </html>
  );
}
