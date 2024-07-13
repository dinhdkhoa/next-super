import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import { FormError, HttpError } from "./https"
import StorageService from "./storage"
import jwt from 'jsonwebtoken'
import authAPI from "@/apiRequests/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleApiError = (error: unknown, setError?: UseFormSetError<any>, duration = 5000): void => {
  if (error instanceof FormError && setError && error.payload.errors.length > 0) {
    error.payload.errors.forEach(error => {
      setError(error.field, {
        type: 'Server',
        message: error.message
      })
    })
  } else if (error instanceof HttpError) {
    toast.error(error.message, {
      duration
    })
  } else if (error && typeof error === 'object' && 'message' in error) {
    toast.error(String(error.message), {
      duration
    })
  }
}

export const isClient = typeof window !== 'undefined'

export async function checkAndRefreshToken(onSuccess?: () => void, onError?: () => void) {
  const refreshToken = StorageService.getRefreshToken()
  const accessToken = StorageService.getAccessToken()

  if (!refreshToken){
    return onError && onError()
  }

  const decodedAT = accessToken ? jwt.decode(accessToken) as { exp: number, iat: number } : { exp: 0, iat: 0 }
  const decodedRT = jwt.decode(refreshToken) as { exp: number }

  const now = Math.round(new Date().getTime() / 1000) // get epoch time in ms

  if (decodedRT.exp <= now){
    StorageService.removeTokens()
    return
  }

  const accessTokenDuration = decodedAT.exp - decodedAT.iat
  const accessTokenValidTimeLeft = decodedAT.exp - now

  if (accessTokenValidTimeLeft < accessTokenDuration / 3) {
    try {
      await authAPI.refreshTokenClient()
      onSuccess && onSuccess()

    } catch (error) {
      onError && onError()
    }
  }
}