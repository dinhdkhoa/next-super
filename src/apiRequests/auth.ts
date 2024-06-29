import http from "@/lib/https";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authAPI = {
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
    })
}

export default authAPI