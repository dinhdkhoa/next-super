import authAPI from "@/apiRequests/auth"
import {
  LoginBodyType,
  RefreshTokenResType
} from "@/schemaValidations/auth.schema"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { HttpError } from "@/lib/https"

interface AppRequest<T = any> extends Request {
  json: () => Promise<T>
}

export async function POST(request: AppRequest<RefreshTokenResType["data"]>) {
  const body = await request.json()
  const nextCookies = cookies()
  try {
    const { accessToken, refreshToken } = body

    const decodedAT = jwt.decode(accessToken) as { exp: number }
    const decodedRT = jwt.decode(refreshToken) as { exp: number }

    nextCookies.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      expires: decodedAT.exp * 1000
    })
    nextCookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      expires: decodedRT.exp * 1000
    })
    return Response.json(body)
  } catch (error) {
    return Response.json(
      {
        message: "Có lỗi xảy ra"
      },
      {
        status: 500
      }
    )
  }
}
