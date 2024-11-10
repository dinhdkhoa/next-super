'use client'

import { socket } from "@/lib/socket"
import jwt from "jsonwebtoken"


import authAPI from "@/apiRequests/auth"
import { useAppContext } from "@/components/app-provider"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { TokenPayload } from "@/types/jwt.types"
import { toast } from "sonner"
// const LogoutComponent = () => {
//   const { mutateAsync } = useLogout()
//   const router = useRouter()
//   const params = useSearchParams()
//   const refreshToken = params.get("rt")
//   const accessToken = params.get("at")

//   useEffect(() => {
//     if (
//       !refreshToken ||
//       refreshToken !== StorageService.getRefreshToken()
//     ) {
//       setTimeout(() => {
//         router.push("/login")
//       }, 5000)
//     } else {
//       const logout = setTimeout(() => {
//         mutateAsync(null as any, {
//           onSettled() {
//             socket.disconnect()
//           }
//         }).finally(() => {
//           router.push("/login")
//         })
//       }, 0)

//       return () => {
//         clearTimeout(logout)
//       }
//     }
//   }, [])

//   return <div>Token Expires, Redirecting ...</div>
// }

export default function Page() {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const message = searchParams.get('message')
  const { setRole } = useAppContext()
  const router = useRouter()
  const setCookieCalledRef = useRef(false);

  const setCookie = useMutation({
    mutationFn: authAPI.setCookies
  })

  useEffect(() => {
    if (setCookieCalledRef.current) {
      if(!message) router.push('/manage/dashboard')
      return;
    }

    if (message) {
      setTimeout(() => {
        toast.error(message);
      });
      setTimeout(() => {
        router.push('/login');
      }, 2500);
      setCookieCalledRef.current = true;
    }

    if (accessToken && refreshToken) {
      setCookie.mutateAsync({ accessToken, refreshToken });
      setCookieCalledRef.current = true;
    }
  }, [accessToken , message, refreshToken])

  return null
}
