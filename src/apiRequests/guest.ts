import http from "@/lib/https";
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const guestAPI = {
    refreshTokenReq: null as Promise<{ status: number, payload: RefreshTokenResType }> | null,
    loginServer: (body: LoginBodyType) => http.post<LoginResType>('/guest/auth/login', body),
    loginClient: (body: LoginBodyType) => http.post<LoginResType>('api/guest/auth/login', body, {
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
    refreshTokenServer: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('auth/guest/refresh-token', body),
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