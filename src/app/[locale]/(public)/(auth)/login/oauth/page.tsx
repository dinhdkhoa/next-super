'use client'

import { socket } from "@/lib/socket"
import jwt from "jsonwebtoken"
import authAPI from "@/apiRequests/auth"
import AppProvider from "@/components/app-provider"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { TokenPayload } from "@/types/jwt.types"
import { toast } from "sonner"
import useAuthStore from "@/hooks/zustand/use-auth-store"

export default function Page() {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const message = searchParams.get('message')
  const router = useRouter()
  const setCookieCalledRef = useRef(false);
  const setRole = useAuthStore.use.setRole()

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
      const {role} = jwt.decode(accessToken) as TokenPayload
      setRole(role)
      setCookieCalledRef.current = true;
    }
  }, [accessToken , message, refreshToken])

  return <div>
    Getting Your Information From Google and Redirecting To Dashboard...
  </div>
}
