import authAPI from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/https";

interface AppRequest<T = any> extends Request {
    json: () => Promise<T>;
}


export async function POST(request: AppRequest<LoginBodyType>) {
    const body = await request.json()
    const nextCookies = cookies()
    try {
        const loginRes = await authAPI.loginServer(body)
        const {payload} = loginRes
        const { accessToken, refreshToken} = payload.data
        
        const decodedAT = jwt.decode(accessToken) as {exp: number}
        const decodedRT = jwt.decode(refreshToken) as {exp: number}

        nextCookies.set('accessToken', accessToken, {
             httpOnly: true,
             path: '/',
             secure: true,
             sameSite: 'lax',
             expires: decodedAT.exp * 1000
        })
        nextCookies.set('refreshToken', refreshToken, {
             httpOnly: true,
             path: '/',
             secure: true,
             sameSite: 'lax',
            expires: decodedRT.exp * 1000
        })
        return Response.json(payload)
    } catch (error) {
        if(error instanceof HttpError){
            return Response.json(error.payload, {
                status: error.status
            })
        
        } else {
            return Response.json({
                message: 'Có lỗi xảy ra'
            },
                {
                    status: 500
                })
        }
    }
}