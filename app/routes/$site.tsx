import { Outlet, useTransition } from "@remix-run/react";

import NavigationHeader from "~/components/navigation/navigation-header";
import SideMenuNavigation from "~/components/navigation/side-menu-navigation";
import SplashScreen from "~/components/splash-screen/splash-screen";
import { useRootData } from "~/utils";

export default function IndexRoute() {
  const transition = useTransition();
  const { sites, user } = useRootData();

  return (
    <>
      <NavigationHeader user={user} sites={sites} />
      <div className="flex grow">
        <SideMenuNavigation />
        <main className="relative grow">
          {transition.state === "loading" && <SplashScreen />}
          <Outlet />
        </main>
      </div>
    </>
  );
}
