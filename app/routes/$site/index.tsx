import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import format from "date-fns/format";

import {
  StatusOnlineIcon,
  StatusOfflineIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/solid";

import { httpGetAsync } from "~/services/http";
import { OperatingMode } from "~/types";
import type { BlastDog, PatternsResponse } from "~/types";

import robotIcon from "~/assets/robot.svg";
import patternIcon from "~/assets/pattern.svg";

interface LoaderData {
  blastDogs: BlastDog[];
  latestPatterns: PatternsResponse;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.site === undefined) {
    throw new Response("Missing site id", { status: 500 });
  }

  const queryStringPatterns = new URLSearchParams();
  queryStringPatterns.append("pageNumber", "0");
  queryStringPatterns.append("pageLength", "5");
  queryStringPatterns.append("patternStatusFilter", "0");
  queryStringPatterns.append("sortField", "dateTimeUpdatedUtc");
  queryStringPatterns.append("sortDirection", "desc");

  const queryStringBlastDogs = new URLSearchParams();
  queryStringBlastDogs.append("siteId", params.site);

  return json<LoaderData>({
    latestPatterns: await httpGetAsync<PatternsResponse>(
      request,
      `/imt-api/sites/${params.site}/web/patterns`,
      queryStringPatterns
    ),
    blastDogs: await httpGetAsync<BlastDog[]>(
      request,
      "/imt-api/blastdog",
      queryStringBlastDogs
    ),
  });
};

export default function IndexRoute() {
  const { blastDogs, latestPatterns } = useLoaderData<LoaderData>();

  const getStatusIcon = (status: OperatingMode): JSX.Element => {
    switch (status) {
      case OperatingMode.Offline:
        return <StatusOfflineIcon width={20} />;
      case OperatingMode.Online:
        return <StatusOnlineIcon width={20} />;
      case OperatingMode.Logging:
        return <img src={robotIcon} width={20} alt="Blast Dog" />;
      default:
        throw new Error();
    }
  };

  return (
    <div className="flex flex-col gap-y-8 p-4">
      <div>
        <h1 className="p-4 text-lg font-medium">Blast DOGs</h1>
        <div className="overflow-hidden rounded bg-slate-300 py-8 shadow-sm">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-400"></th>
                <th className="border-b border-slate-400 p-4 pl-8 pt-0 pb-3 text-left font-medium">
                  Name
                </th>
                <th className="border-b border-slate-400 p-4 pt-0 pb-3 text-left font-medium">
                  Fuel Percentage
                </th>
                <th className="border-b border-slate-400 p-4 pr-8 pt-0 pb-3 text-left font-medium">
                  Last Update
                </th>
                <th className="border-b border-slate-400 p-4 pr-8 pt-0 pb-3 text-left font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-100">
              {blastDogs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="border-b border-r border-slate-200 p-4 pl-8 text-slate-600"
                  >
                    No Blast DOGs assigned to this site.
                  </td>
                </tr>
              )}
              {blastDogs.map(
                ({
                  blastDogId,
                  blastDogName,
                  fuelLevelPercentage,
                  lastUpdateTime,
                  status,
                }) => (
                  <tr key={blastDogId}>
                    <td className="border-b border-r border-slate-200 text-slate-600">
                      <img
                        className="m-auto"
                        src={robotIcon}
                        width={20}
                        alt="Blast Dog"
                      />
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pl-8 text-slate-600">
                      {blastDogName}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 text-slate-600">
                      {fuelLevelPercentage && fuelLevelPercentage >= 0
                        ? fuelLevelPercentage
                        : "-"}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pr-8 text-slate-600">
                      {lastUpdateTime !== null
                        ? format(
                            new Date(lastUpdateTime),
                            "dd-MM-yyyy HH:mm:ss aaa"
                          )
                        : "-"}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pr-8 text-slate-600">
                      <div className="flex">
                        <div className="mr-4">{getStatusIcon(status)}</div>
                        <div>{status}</div>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h1 className="p-4 text-lg font-medium">Recent Patterns</h1>
        <div className="overflow-hidden rounded bg-slate-300 py-8 shadow-sm">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-400"></th>
                <th className="border-b border-slate-400 p-4 pl-8 pt-0 pb-3 text-left font-medium">
                  Name
                </th>
                <th className="border-b border-slate-400 p-4 pt-0 pb-3 text-left font-medium">
                  Bench
                </th>
                <th className="border-b border-slate-400 p-4 pr-8 pt-0 pb-3 text-left font-medium">
                  Hole Count
                </th>
                <th className="border-b border-slate-400 p-4 pr-8 pt-0 pb-3 text-left font-medium">
                  Percentage Logged
                </th>
                <th className="border-b border-slate-400 p-4 pr-8 pt-0 pb-3 text-left font-medium">
                  Last Updated
                </th>
                <th className="border-b border-slate-400 p-4 pr-8 pt-0 pb-3 text-left font-medium">
                  Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-100">
              {latestPatterns.patterns.map(
                ({
                  patternId,
                  name,
                  bench,
                  holeCount,
                  percentageLogged,
                  dateTimeUpdatedUtc,
                  isActive,
                }) => (
                  <tr key={patternId}>
                    <td className="border-b border-r border-slate-200 text-slate-600">
                      <img
                        className="m-auto"
                        src={patternIcon}
                        width={20}
                        alt="Blast Dog"
                      />
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pl-8 text-slate-600">
                      {name}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pl-8 text-slate-600">
                      {bench}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 text-slate-600">
                      {holeCount && holeCount >= 0 ? holeCount : "-"}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pr-8 text-slate-600">
                      {percentageLogged && percentageLogged >= 0
                        ? percentageLogged
                        : "-"}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pr-8 text-slate-600">
                      {dateTimeUpdatedUtc !== null
                        ? format(
                            new Date(dateTimeUpdatedUtc),
                            "dd-MM-yyyy HH:mm:ss aaa"
                          )
                        : "-"}
                    </td>
                    <td className="border-b border-r border-slate-200 p-4 pr-8 text-slate-600">
                      {isActive ? (
                        <CheckIcon width={20} />
                      ) : (
                        <XCircleIcon width={20} />
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
