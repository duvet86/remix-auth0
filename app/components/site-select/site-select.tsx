import type { ChangeEvent } from "react";
import {
  useCurrentSite,
  useCurrentSiteDispatch,
} from "~/services/current-site-context";
import type { Site } from "~/types";

interface Props {
  sites: Site[];
}

export default function SiteSelect({ sites }: Props) {
  const currentSite = useCurrentSite();
  const setCurrentSite = useCurrentSiteDispatch();

  const siteDictionary = sites.reduce<Record<string, Site>>((res, site) => {
    res[site.siteId] = site;

    return res;
  }, {});

  return (
    <select
      className="mr-6 rounded border border-solid border-gray-300 bg-imdex-blue px-3 py-1.5 font-medium"
      aria-label="Default select example"
      value={currentSite?.siteId}
      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
        setCurrentSite(siteDictionary[event.target.value])
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
