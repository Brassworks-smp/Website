import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRoadmapData } from "./roadmap.service";

export const roadmapQuery = queryOptions({
    queryKey: ["cockpit", "roadmap"],
    queryFn: getRoadmapData,
    staleTime: 5 * 60 * 1000,
});

export function useRoadmap() {
    return useQuery(roadmapQuery);
}
