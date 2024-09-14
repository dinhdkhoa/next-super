import tableAPI from "@/apiRequests/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const queryClient = useQueryClient()

export const useAddTableMutation = () => {
    return useMutation({
        mutationFn: tableAPI.addTable,
        onSuccess: () => {
            queryClient.invalidateQueries({exact: true, queryKey: ['tables-list']})
        }
    })
}

export const useGetTables = () => {
    return useQuery({
        queryKey: ['tables-list'],
        queryFn: tableAPI.getTables
    })
}