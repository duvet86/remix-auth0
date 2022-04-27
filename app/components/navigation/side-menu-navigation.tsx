import { NavLink, useParams } from "@remix-run/react";

import { HomeIcon } from "@heroicons/react/solid";

export default function SideMenuNavigation() {
  const { site } = useParams();

  const linkClasses = "flex items-center block p-4 font-medium tracking-wide";
  const activeClasses = linkClasses + " bg-imdex-blue";

  return (
    <aside className="w-56 bg-imdex-dark-blue text-white">
      <ul>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? activeClasses : linkClasses
            }
            to={`/${site}`}
          >
            <HomeIcon className="mr-4 h-5 w-5" />
            <span>Home</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
