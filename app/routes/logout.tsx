import type { LoaderFunction } from "@remix-run/server-runtime";

import { logout } from "~/services/authorize";

export const loader: LoaderFunction = async ({ request }) => {
  return logout(request);
};
