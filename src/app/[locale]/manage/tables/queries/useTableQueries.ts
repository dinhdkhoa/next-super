import revalidateTag from "@/apiRequests/revalidate"
import tableAPI from "@/apiRequests/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useAddTableMutation =  () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tableAPI.addTable,
        onSuccess: async () => {
            queryClient.invalidateQueries({queryKey: ['tables-list']})
            await revalidateTag('tables-list')
        }
    })
}

export const useGetTableDetail = (id: number) => {
    return useQuery({
        queryKey: ['getTableDetail', id],
        queryFn: () => tableAPI.getTableDetail(id),
        enabled: Boolean(id)
    })
}
export const useGetTables = () => {
    return useQuery({
        queryKey: ['tables-list'],
        queryFn: tableAPI.getTables,
    })
}

export const useEditTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tableAPI.updateTable,
        onSuccess: async () => {
            queryClient.invalidateQueries({queryKey: ['tables-list']})
        }
    })
}
export const useDeleteTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: tableAPI.deleteTable,
        onSuccess: async () => {
            queryClient.invalidateQueries({queryKey: ['tables-list']})
            await revalidateTag('tables-list')
        }
    })
}