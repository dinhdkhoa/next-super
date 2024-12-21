import authAPI from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/https";
import guestAPI from "@/apiRequests/guest";

interface AppRequest<T = any> extends Request {
    json: () => Promise<T>;
}


export async function POST() {
    const nextCookies = cookies()
    const refreshToken = nextCookies.get('refreshToken')?.value 
    if ( !refreshToken) {
        return Response.json({
            message: 'Không tìm thấy refresh token'
        }, {
            status: 401
        })
    }

    try {
        const loginRes = await guestAPI.refreshTokenServer({ refreshToken: refreshToken })
        const { payload } = loginRes
        const { accessToken, refreshToken: refreshTokenRes } = payload.data

        const decodedAT = jwt.decode(accessToken) as { exp: number }
        const decodedRT = jwt.decode(refreshTokenRes) as { exp: number }

        nextCookies.set('accessToken', accessToken, {
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'lax',
            expires: decodedAT.exp * 1000
        })
        nextCookies.set('refreshToken', refreshTokenRes, {
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'lax',
            expires: decodedRT.exp * 1000
        })
        return Response.json(payload)
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status
            })

        } else {
            return Response.json({
                message: 'Có lỗi xảy ra khi refresh token'
            },
                {
                    status: 401
                })
        }
    }
}