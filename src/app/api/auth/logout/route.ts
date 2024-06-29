import authAPI from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/https";

interface AppRequest<T = any> extends Request {
    json: () => Promise<T>;
}


export async function POST() {
    const nextCookies = cookies()
    const accessToken = nextCookies.get('accessToken')?.value
    const refreshToken = nextCookies.get('refreshToken')?.value
    if (!accessToken || !refreshToken){
        return Response.json({
            message: 'Không tìm thấy access token hoặc refresh token'
        }, {
            status: 200
        })
    }

    try {
        const logoutRes = await authAPI.logoutServer({
            accessToken,
            refreshToken
        })
        nextCookies.delete('accessToken')
        nextCookies.delete('refreshToken')
        return Response.json({
            message: 'Logout thành công'
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            message: 'Logout gọi đến server lỗi'
        }, {
            status: 200
        })
    }
}