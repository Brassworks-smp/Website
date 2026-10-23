import { queryOptions, useQuery } from "@tanstack/react-query";
import { getLatestLauncherRelease } from "./launcher-release.service";

export const launcherReleaseQuery = queryOptions({
    queryKey: ["github", "BrassworksLauncher", "latest-release"],
    queryFn: getLatestLauncherRelease,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
});

export function useLauncherRelease() {
    return useQuery(launcherReleaseQuery);
}
