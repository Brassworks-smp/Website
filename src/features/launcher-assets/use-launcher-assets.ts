import { queryOptions, useQuery } from "@tanstack/react-query";
import { getLauncherAssets } from "./launcher-assets.service";

export const launcherAssetsQuery = queryOptions({
    queryKey: ["cockpit", "launcherassets"],
    queryFn: getLauncherAssets,
    staleTime: 5 * 60 * 1000,
});

export function useLauncherAssets() {
    return useQuery(launcherAssetsQuery);
}
