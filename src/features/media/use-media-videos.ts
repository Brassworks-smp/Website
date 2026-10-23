import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMediaVideos } from "./media.service";

export const mediaVideosQuery = queryOptions({
    queryKey: ["cockpit", "mediavideos"],
    queryFn: getMediaVideos,
    staleTime: 5 * 60 * 1000,
});

export function useMediaVideos() {
    return useQuery(mediaVideosQuery);
}
