import http from "@/lib/https";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authAPI = {
    loginServer: (body: LoginBodyType) => http.post<LoginResType>('auth/login', body),
    loginClient: (body: LoginBodyType) => http.post<LoginResType>('api/auth/login', body, {
        baseUrl: ''
    })
}

export default authAPI