import accountAPI from "@/apiRequests/account"
import orderAPI from "@/apiRequests/order"
import { CreateGuestBodyType } from "@/schemaValidations/account.schema"
import { CreateOrdersBodyType, GetOrdersQueryParamsType, PayGuestOrdersBodyType, UpdateOrderBodyType } from "@/schemaValidations/order.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

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

export const useAdminUpdateOrderDetail = () => {
    return useMutation({
        mutationFn: ({orderId, ...body}:  UpdateOrderBodyType & {orderId: number}) => orderAPI.adminUpdateOrder(orderId, body)
    })
}

export const useAdminPayTable = () => {
    return useMutation({
        mutationFn: (body: PayGuestOrdersBodyType) => orderAPI.adminPayTable(body)
    })
}

export const useAdminAddOrder = () => {
    return useMutation({
        mutationFn: orderAPI.adminAddOrder
    })
}

export const useAdminAddGuest = () => {
    return useMutation({
        mutationFn:accountAPI.addGuest
    })
}