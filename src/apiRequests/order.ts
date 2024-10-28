import http from "@/lib/https";
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";
import { CreateOrdersBodyType, CreateOrdersResType, GetOrderDetailResType, GetOrdersQueryParamsType, GetOrdersResType, PayGuestOrdersBodyType, PayGuestOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import queryString from 'query-string';

const orderAPI = {
    guestOrder: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>('/guest/orders', body),
    guestGetOrder: (token?: string) => http.get<GuestGetOrdersResType>('/guest/orders',  {
    headers: {
        Authorization: `Bearer ${token}`
    } }),
    adminGetOrderList:  (queryParams: GetOrdersQueryParamsType) => http.get<GetOrdersResType>('/orders?' + queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
    })),
    adminUpdateOrder:  (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
    adminGetOrderDetail:  (orderId: number) => http.get<GetOrderDetailResType>(`/orders/${orderId}`),
    adminPayTable:  (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>(`/orders/pay`, body),
    adminAddOrder:  (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>(`/orders`, body),
}

export default orderAPI