"use client"
import StorageService from "@/lib/storage"
import useLogout from "@/queries/useLogout"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function Logout() {
  const { mutateAsync } = useLogout()
  const router = useRouter()
  const params = useSearchParams()
  const refreshToken = params.get("rt")
  const accessToken = params.get("at")

  useEffect(() => {
    if (
      !refreshToken ||
      refreshToken !== StorageService.getRefreshToken()
    ) {
      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } else {
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

  return <div>Token Expires, Redirecting ...</div>
}
