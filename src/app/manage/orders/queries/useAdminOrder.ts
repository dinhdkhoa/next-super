import orderAPI from "@/apiRequests/order"
import { GetOrdersQueryParamsType } from "@/schemaValidations/order.schema"
import { useQuery } from "@tanstack/react-query"

export const useAdminGetListOrder = (queryParams : GetOrdersQueryParamsType) => {
    return useQuery({
        queryKey: ['orders', queryParams],
        queryFn: () => orderAPI.adminGetOrderList(queryParams)
    })
}
export const useAdminGetOrderDetail = (id: number) => {
    return useQuery({
        queryKey: ['orders-details', id],
        queryFn: () => orderAPI.adminGetOrderDetail(id),
        enabled: Boolean(id)
    })
}