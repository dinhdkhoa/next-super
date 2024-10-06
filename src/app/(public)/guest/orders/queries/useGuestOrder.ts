import guestAPI from "@/apiRequests/guest"
import orderAPI from "@/apiRequests/order"
import { useMutation, useQueries, useQuery } from "@tanstack/react-query"

export const useGuestOrderMutation = () => {
    return useMutation({
        mutationFn: orderAPI.guestOrder
    })
}
export const useGuestOrderList = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: orderAPI.guestGetOrder
    })
}