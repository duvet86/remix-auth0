import { useNavigate, useParams } from "@remix-run/react";
import type { ChangeEvent } from "react";
import type { Site } from "~/types";

interface Props {
  sites: Site[];
}

export default function SiteSelect({ sites }: Props) {
  const { site } = useParams();
  const navigate = useNavigate();

  return (
    <select
      className="mr-6 rounded border border-solid border-gray-300 bg-imdex-blue px-3 py-1.5 font-medium"
      aria-label="Default select example"
      value={site}
      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
        navigate(`/${event.target.value}`)
      }
    >
      {sites.map(({ siteId, name }) => (
        <option key={siteId} value={siteId}>
          {name}
        </option>
      ))}
    </select>
  );
}
