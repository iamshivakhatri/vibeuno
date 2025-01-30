import { MutationKey, MutationFunction, useQueryClient, useMutation, useMutationState } from "@tanstack/react-query"
import { toast } from "sonner"

type QueryKeyType = string | (string | number)[]

export const useMutationData = (
    mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    queryKey?: QueryKeyType,
    onSuccess?: () => void,
) => {
    const client = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationKey,
        mutationFn,
        onSuccess: (data) => {
            if (onSuccess) onSuccess()
            return toast(
                'Success',
                {
                    description: data?.message,
                }
            )
        },
        onSettled: async () => {
            if (!queryKey) return

            // Transform the queryKey to always be an array
            const formattedQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey]
            
            return await client.invalidateQueries({
                queryKey: formattedQueryKey,
                exact: true,
            })
        },
        onError: (error) => {
            return toast(
                'Error',
                {
                    description: error?.message,
                }
            )
        },
    })
    return { mutate, isPending }
}

// export const useMutationData = (
//     mutationKey: MutationKey,
//     mutationFn: MutationFunction<any, any>,
//     queryKey?: string,
//     onSuccess?: () => void,
// ) => {
//     const client = useQueryClient()
//     const {mutate, isPending} = useMutation({
//         mutationKey,
//         mutationFn,
//         onSuccess: (data) => {
//             if (onSuccess) onSuccess()
//             return toast(
//                 'Success',
//                 {
//                     description: data?.message,
//                 }
//             )
//         },
//         onSettled: async () => {
//             return await client.invalidateQueries({
//                 queryKey: queryKey ? [queryKey] : undefined,
//                 exact: true,
//             })
//         },
//         onError: (error) => {
//             return toast(
//                 'Error',
//                 {
//                     description: error?.message,
//                 }
//             )
//         },
//     })
//     return {mutate, isPending}
// }

export const useMutationDataState = (mutationKey: MutationKey) => {
    const data = useMutationState({
        filters: {mutationKey},
        select: (mutation) => {
            return{
                variables: mutation.state.variables as any,
                status: mutation.state.status,

            }
        },
    })
    const latestVariables = data[data.length -1]
    return {latestVariables}
}