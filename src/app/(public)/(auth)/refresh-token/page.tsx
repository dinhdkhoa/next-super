"use client"
import { useAppContext } from '@/components/app-provider'
import { checkPathName } from '@/constants/route-middleware'
import StorageService from '@/lib/storage'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

const RefreshTokenComponent = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const refreshToken = params.get("rt")
  const returnUrl = params.get("returnUrl")
  const { setRole } = useAppContext()
  useEffect(() => {
    console.log(checkPathName(pathname).isPublicPath, 'checkPathName(pathname).isPublicPath ')
    if(checkPathName(pathname).isPublicPath || checkPathName(pathname).isAuthPath) return
    if (
      !refreshToken ||
      refreshToken !== StorageService.getRefreshToken()
    ) {
      router.push("/login")
      setRole()
    } else {
      checkAndRefreshToken(() => {
        router.push(returnUrl || '/manage/setting')
      })
    }
  }, [pathname, router])
  return (
    <div>Getting Token</div>
  )
}

export default function RefreshToken() {
  return (
    <Suspense>
      <RefreshTokenComponent />
    </Suspense>
  )
}

