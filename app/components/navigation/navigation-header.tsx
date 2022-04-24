import { Link } from "react-router-dom";
import type { Auth0Profile } from "~/services/authorize";

import logo from "./logo_white.svg";

interface Props {
  user?: Auth0Profile;
}

export default function NavigationHeader({ user }: Props) {
  return (
    <header>
      <nav className="flex flex-wrap items-center justify-between bg-imdex-blue p-1 text-white">
        <Link to="/" className="ml-2 mr-6">
          <img width="100" src={logo} alt="logo" />
        </Link>
        <div className="flex items-center">
          {user && <div className="mr-2">{user._json.nickname}</div>}
          <Link
            className="m-2 flex items-center rounded border px-3 py-1 text-sm text-sm hover:border-gray-400 hover:text-gray-400"
            to="/logout"
          >
            Logout
          </Link>
        </div>
      </nav>
    </header>
  );
}
