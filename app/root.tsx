import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import NavigationHeader from "./components/navigation/navigation-header";
import type { Auth0Profile } from "./services/authorize";
import { authorize } from "./services/authorize";
import { httpGetAsync } from "./services/http";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import type { Site, UserAuthorisation } from "./types";

import emptyLogo from "./empty_state.svg";
import SideMenuNavigation from "./components/navigation/side-menu-navigation";
import { CurrentSiteContextProvider } from "./services/current-site-context";

type LoaderData = {
  user: Auth0Profile;
  sites: Site[];
  initialSelectedSite: Site;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  return authorize(request, async (user) => {
    const sites = await httpGetAsync<Site[]>(request, "/imt-api/sites");

    const siteDictionary = sites.reduce<Record<string, Site>>((res, site) => {
      res[site.siteId] = site;

      return res;
    }, {});

    const userAuthorisation = user._json[
      "https://mining.imdexhub.com/permissions"
    ] as UserAuthorisation;

    const siteRoles = userAuthorisation.siteRoles;
    if (userAuthorisation == null || siteRoles.length === 0) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const userSites = userAuthorisation.siteRoles.map(
      ({ siteId }) => siteDictionary[siteId]
    );

    return json<LoaderData>({
      user,
      sites: userSites,
      initialSelectedSite: siteDictionary[siteRoles[0].siteId],
    });
  });
};

export default function App() {
  const { user, sites, initialSelectedSite } = useLoaderData();

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col">
        <CurrentSiteContextProvider initialSiteValue={initialSelectedSite}>
          <NavigationHeader user={user} sites={sites} />
          <div className="flex grow">
            <SideMenuNavigation />
            <main className="grow p-4">
              <Outlet />
            </main>
          </div>
        </CurrentSiteContextProvider>

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
