import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCmsFonts } from "./fonts.service";

export const fontsQuery = queryOptions({
    queryKey: ["cockpit", "fonts"],
    queryFn: getCmsFonts,
    staleTime: 60 * 60 * 1000,
});

export function useCmsFonts() {
    return useQuery(fontsQuery);
}
