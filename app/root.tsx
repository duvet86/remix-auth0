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
} from "@remix-run/react";
import NavigationHeader from "./components/navigation/navigation-header";
import type { Auth0Profile } from "./services/authorize";
import { authorize } from "./services/authorize";
import { httpGetAsync } from "./services/http";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import type { Site } from "./types";
import { useUser } from "./utils";

import emptyLogo from "./empty_state.svg";

type LoaderData = {
  user: Auth0Profile;
  sites: Site[];
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
    return json<LoaderData>({
      user,
      sites: await httpGetAsync("/imt-api/sites"),
    });
  });
};

export default function App() {
  const user = useUser();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <NavigationHeader user={user} />
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

  console.error(caught.data);

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
