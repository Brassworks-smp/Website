import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFinanceData } from "./finance.service.ts";

export const financesQuery = queryOptions({
    queryKey: ["cockpit", "finances"],
    queryFn: getFinanceData,
    staleTime: 5 * 60 * 1000,
});

export function useFinances() {
    return useQuery(financesQuery);
}
