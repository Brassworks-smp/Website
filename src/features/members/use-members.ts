import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMembers } from "./members.service";

export const membersQuery = queryOptions({
    queryKey: ["cockpit", "members"],
    queryFn: getMembers,
    staleTime: 5 * 60 * 1000,
});

export function useMembers() {
    return useQuery(membersQuery);
}
