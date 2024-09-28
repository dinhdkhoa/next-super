import http from "@/lib/https";
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const guestAPI = {
    refreshTokenReq: null as Promise<{ status: number, payload: RefreshTokenResType }> | null,
    loginServer: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/guest/auth/login', body),
    loginClient: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('api/guest/auth/login', body, {
        baseUrl: ''
    }),
    logoutServer: (body: {
        refreshToken: string,
        accessToken: string
    }) => http.post<{ message: string }>('/guest/auth/logout', {
        refreshToken: body.refreshToken
    }, {
        headers: {
            'Authorization': `Bearer ${body.accessToken}`
        }
    }),
    logoutClient: () => http.post<{message: string}>('api/guest/auth/logout', null, {
        baseUrl: ''
    }),
    refreshTokenServer: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/guest/auth/refresh-token', body),
    async refreshTokenClient(){
        if (this.refreshTokenReq){
            return this.refreshTokenReq
        }
        this.refreshTokenReq = http.post<RefreshTokenResType>('api/guest/auth/refresh-token', null, {
            baseUrl: ''
        })
        const res = await this.refreshTokenReq
        this.refreshTokenReq = null
        return res
    },
}

export default guestAPI