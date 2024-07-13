"use client"
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

  useEffect(() => {
    if (
      !refreshToken ||
      refreshToken !== StorageService.getRefreshToken()
    ) {
        router.push("/login")
    } else {
        checkAndRefreshToken(() => {
            router.push(returnUrl || '/manage/setting')
        })
  }}, [])
  return (
    <div>Getting Token</div>
  )
}

