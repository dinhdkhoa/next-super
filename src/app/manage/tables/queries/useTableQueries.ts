import tableAPI from "@/apiRequests/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useAddTableMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tableAPI.addTable,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tables-list']})
        }
    })
}

export const useGetTables = (id: number) => {
    return useQuery({
        queryKey: ['getTableDetail', id],
        queryFn: () => tableAPI.getTableDetail(id),
        enabled: Boolean(id)
    })
}
export const useGetTableDetail = () => {
    return useQuery({
        queryKey: ['tables-list'],
        queryFn: tableAPI.getTables,
    })
}

export const useEditTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tableAPI.updateTable,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tables-list']})
        }
    })
}
export const useDeleteTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tableAPI.deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tables-list']})
        }
    })
}