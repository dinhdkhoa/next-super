'use client'

import { checkPathName } from "@/constants/route-middleware"
import { checkAndRefreshToken } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const CHECK_VALID_TOKEN_INTERVAL = 1000 as const

function RefreshToken() {
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        if(checkPathName(pathname).isPublicPath || checkPathName(pathname).isAuthPath) return
        let interval : any = null

        checkAndRefreshToken(undefined, () => {
            clearInterval(interval)
            router.push('/login')
        })

        interval = setInterval(() => checkAndRefreshToken(undefined, () => {
            clearInterval(interval)
            router.push('/login')
        }), CHECK_VALID_TOKEN_INTERVAL)
        return() => {
            clearInterval(interval)
        }
    },[pathname, router])

  return (
    null
  )
}

export default RefreshToken