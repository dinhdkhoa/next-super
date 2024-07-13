"use client"
import { useAppContext } from '@/components/app-provider'
import StorageService from '@/lib/storage'
import { checkAndRefreshToken } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function RefreshToken() {
    const router = useRouter()
     const params = useSearchParams()
  const refreshToken = params.get("rt")
  const returnUrl = params.get("returnUrl")
  const {setIsAuth} = useAppContext()


  useEffect(() => {
    if (
      !refreshToken ||
      refreshToken !== StorageService.getRefreshToken()
    ) {
        router.push("/login")
        setIsAuth(false)
    } else {
        checkAndRefreshToken(() => {
            router.push(returnUrl || '/manage/setting')
        })
  }}, [])
  return (
    <div>Getting Token</div>
  )
}

