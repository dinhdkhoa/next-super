import authAPI from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/https";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import accountAPI from "@/apiRequests/account";

interface AppRequest<T = any> extends Request {
    json: () => Promise<T>;
}


export async function PUT(request: AppRequest<ChangePasswordV2BodyType>) {
    const body = await request.json()
    const nextCookies = await cookies()
    const accessTokenFromCookie = nextCookies.get('accessToken')?.value

    if ( !accessTokenFromCookie) {
        return Response.json({
            message: 'Không tìm thấy access token'
        }, {
            status: 401
        })
    }
    try {
        const changePWRes = await accountAPI.changePWServer(body,accessTokenFromCookie)
        const {payload} = changePWRes
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