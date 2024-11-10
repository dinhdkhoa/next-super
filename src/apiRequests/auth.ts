import http from "@/lib/https";
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const authAPI = {
    refreshTokenReq: null as Promise<{ status: number, payload: RefreshTokenResType }> | null,
    setCookiesReq: null as Promise<{ status: number, payload: RefreshTokenResType['data'] }> | null,
    loginServer: (body: LoginBodyType) => http.post<LoginResType>('auth/login', body),
    loginClient: (body: LoginBodyType) => http.post<LoginResType>('api/auth/login', body, {
        baseUrl: ''
    }),
    logoutServer: (body: {
        refreshToken: string,
        accessToken: string
    }) => http.post<{ message: string }>('auth/logout', {
        refreshToken: body.refreshToken
    }, {
        headers: {
            'Authorization': `Bearer ${body.accessToken}`
        }
    }),
    logoutClient: () => http.post<{message: string}>('api/auth/logout', null, {
        baseUrl: ''
    }),
    refreshTokenServer: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('auth/refresh-token', body),
    async refreshTokenClient(){
        if (this.refreshTokenReq){
            return this.refreshTokenReq
        }
        this.refreshTokenReq = http.post<RefreshTokenResType>('api/auth/refresh-token', null, {
            baseUrl: ''
        })
        const res = await this.refreshTokenReq
        this.refreshTokenReq = null
        return res
    },
    async setCookies(body: RefreshTokenResType['data']){
        if (this.setCookiesReq){
            return this.setCookiesReq
        }
        this.setCookiesReq = http.post<RefreshTokenResType['data']>('api/auth/set-cookies', body, {
            baseUrl: ''
        })
        const res = await this.setCookiesReq
        this.setCookiesReq = null
        return res
    },
}

export default authAPI