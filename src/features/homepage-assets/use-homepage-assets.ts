import { queryOptions, useQuery } from "@tanstack/react-query";
import { getHomepageAssets } from "./homepage-assets.service";

export const homepageAssetsQuery = queryOptions({
    queryKey: ["cockpit", "homepageassets"],
    queryFn: getHomepageAssets,
    staleTime: 5 * 60 * 1000,
});

export function useHomepageAssets() {
    return useQuery(homepageAssetsQuery);
}
