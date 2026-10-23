import { queryOptions, useQuery } from "@tanstack/react-query";
import { getHeroSlides } from "./hero.service";

export const heroSlidesQuery = queryOptions({
    queryKey: ["cockpit", "heroslides"],
    queryFn: getHeroSlides,
    staleTime: 5 * 60 * 1000,
});

export function useHeroSlides() {
    return useQuery(heroSlidesQuery);
}
