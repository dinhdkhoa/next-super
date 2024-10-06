import http from "@/lib/https";
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schemaValidations/order.schema";

const orderAPI = {
    guestOrder: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>('/guest/orders', body),
    guestGetOrder: () => http.get<GuestGetOrdersResType>('/guest/orders',  { next: { tags: ['guest-order-list'] } }),
    adminGetOrderList:  () => http.get<GetOrdersResType>('/orders'),
    adminUpdateOrder:  (orderId: number, body: UpdateOrderBodyType) => http.post<UpdateOrderResType>(`/orders${orderId}`, body),
}

export default orderAPI