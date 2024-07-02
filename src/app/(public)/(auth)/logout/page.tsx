"use client"
import StorageService from "@/lib/storage"
import useLogout from "@/queries/useLogout"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect } from "react"

export default function Logout() {
  const { mutateAsync } = useLogout()
  const router = useRouter()
  const params = useSearchParams()
  const refreshToken = params.get("rt")
  console.log(refreshToken)

  useEffect(() => {
    if (!refreshToken || refreshToken !== StorageService.getRefreshToken) {
        router.push('/manage/setting')
    }
    else {
        const logout = setTimeout(() => {
          mutateAsync(null as any, {
            onSettled() {}
          }).finally(() => {
            router.push("/login")
          })
        }, 0)
    
        return () => {
          clearTimeout(logout)
        }
    }
  }, [])
  return <div></div>
}
