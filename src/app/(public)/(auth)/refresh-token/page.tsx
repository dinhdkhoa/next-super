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
    if (checkPathName(pathname).isPublicPath || checkPathName(pathname).isAuthPath) return
    if (
      !refreshToken ||
      refreshToken !== StorageService.getRefreshToken()
    ) {
      router.push("/login")
      console.log('case1')
      setRole()
    } else {
      StorageService.setAccessToken('')
      checkAndRefreshToken(() => {
        router.push(returnUrl || '/manage/setting')
      }, () => {
      console.log('case2')
        setRole()
      })
    }
  }, [pathname, router, returnUrl])
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

