import { Outlet } from "@remix-run/react";

import NavigationHeader from "~/components/navigation/navigation-header";
import SideMenuNavigation from "~/components/navigation/side-menu-navigation";
import { useRootData } from "~/utils";

export default function IndexRoute() {
  const { sites, user } = useRootData();

  return (
    <>
      <NavigationHeader user={user} sites={sites} />
      <div className="flex grow">
        <SideMenuNavigation />
        <main className="grow p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
}
