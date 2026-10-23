import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSiteAnnouncement } from "./announcement.service";

export const siteAnnouncementQuery = queryOptions({
    queryKey: ["cockpit", "announcement"],
    queryFn: getSiteAnnouncement,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
});

export function useSiteAnnouncement() {
    return useQuery(siteAnnouncementQuery);
}
