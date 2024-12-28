import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import { FormError, HttpError } from "./https"
import StorageService from "./storage"
import jwt from "jsonwebtoken"
import authAPI from "@/apiRequests/auth"
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { TokenPayload } from "@/types/jwt.types"
import guestAPI from "@/apiRequests/guest"
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react"
import { format } from "date-fns"
import { defaultLocale } from "@/i18n/i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleApiError = (
  error: unknown,
  setError?: UseFormSetError<any>,
  duration = 5000
): void => {
  if (
    error instanceof FormError &&
    setError &&
    error.payload.errors.length > 0
  ) {
    error.payload.errors.forEach((error) => {
      setError(error.field, {
        type: "Server",
        message: error.message
      })
    })
  } else if (error instanceof HttpError) {
    toast.error(error.message, {
      duration
    })
  } else if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    isClient
  ) {
    toast.error(String(error.message), {
      duration
    })
  }
}

export const isClient = typeof window !== "undefined"

export async function checkAndRefreshToken(
  onSuccess?: () => void,
  onError?: () => void,
  force?: boolean
) {
  const refreshToken = StorageService.getRefreshToken()
  const accessToken = StorageService.getAccessToken()

  if (!refreshToken) {
    authAPI.logoutClient()
    return onError && onError()
  }

  const decodedAT = accessToken
    ? (jwt.decode(accessToken) as TokenPayload)
    : { exp: 0, iat: 0 }
  const decodedRT = jwt.decode(refreshToken) as TokenPayload

  const now = new Date().getTime() / 1000 // get epoch time in ms

  if (decodedRT.exp <= now - 1) {
    // bc expires in cookies is diffreent from ls for uknown reasons
    StorageService.removeTokens()
    return
  }

  const accessTokenDuration = decodedAT.exp - decodedAT.iat
  const accessTokenValidTimeLeft = decodedAT.exp - now

  if (accessTokenValidTimeLeft < accessTokenDuration / 3 || force) {
    try {
      const role = decodedRT.role
      if (role !== Role.Guest) {
        await authAPI.refreshTokenClient()
      } else {
        await guestAPI.refreshTokenClient()
      }
      onSuccess && onSuccess()
    } catch (error) {
      onError && onError()
    }
  }
}

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  )
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  )
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss")
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(number)
}

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn"
    case DishStatus.Unavailable:
      return "Không có sẵn"
    default:
      return "Ẩn"
  }
}

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ"
    case OrderStatus.Paid:
      return "Đã thanh toán"
    case OrderStatus.Pending:
      return "Chờ xử lý"
    case OrderStatus.Processing:
      return "Đang nấu"
    default:
      return "Từ chối"
  }
}

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn"
    case TableStatus.Reserved:
      return "Đã đặt"
    default:
      return "Ẩn"
  }
}

export const getTableLink = ({
  token,
  tableNumber
}: {
  token: string
  tableNumber: number
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + `/${defaultLocale}` + "/tables/" + tableNumber + "?token=" + token
  )
}

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF\u0102\u0103\u01A0\u01A1\u01AF\u01B0\u1EA0-\u1EF9\-]+/g, "")
    .replace(/\-\-+/g, "-");
};


export const getCookieValueOnClient = (name: string) => {
  if(!isClient) return
  const regex = new RegExp(`(^| )${name}=([^;]+)`)
  const match = document.cookie.match(regex)
  if (match) {
    return match[2]
  }
}

export const slugifyDish = (name: string, id: number) => `${slugify(name)}-i.${id}`