"use client"
import { checkPathName } from '@/constants/route-middleware'
import useAuthStore from "@/hooks/zustand/use-auth-store"
import StorageService from '@/lib/storage'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const RefreshTokenComponent = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const refreshToken = params.get("rt")
  const returnUrl = params.get("returnUrl")
  const setRole = useAuthStore.use.setRole()

  useEffect(() => {
    if (checkPathName(pathname).isPublicPath || checkPathName(pathname).isAuthPath) return
    if (
      !refreshToken ||
      refreshToken !== StorageService.getRefreshToken()
    ) {
      router.push("/login")
      setRole()
    } else {
      StorageService.setAccessToken('')
      checkAndRefreshToken(() => {
        router.push(returnUrl || '/manage/setting')
      }, () => {
        setRole()
      })
    }
  }, [pathname, router, returnUrl])
  return (
    <div>Getting Token</div>
  )
}

export default RefreshTokenComponent