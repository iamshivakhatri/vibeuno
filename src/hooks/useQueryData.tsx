'use client'
import { useQuery , QueryKey, QueryFunction, Enabled, MutationKey, useMutationState} from "@tanstack/react-query"

export const useQueryData = (queryKey: QueryKey, queryFn: QueryFunction, enabled?: Enabled) => {
    const {data, isPending, isFetched, refetch, isFetching} = useQuery({
        queryKey,
        queryFn,
        enabled
    })
    return {data, isPending, isFetched, refetch, isFetching}
}

