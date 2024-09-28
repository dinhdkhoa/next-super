'use client'

import { checkAndRefreshToken } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_ROUTE = ['/login', '/register', '/logout', '/refresh-token']
const CHECK_VALID_TOKEN_INTERVAL = 1000 as const

function RefreshToken() {
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        if(UNAUTHENTICATED_ROUTE.includes(pathname) || pathname.startsWith('/tables')) return 
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
    },[pathname])

  return (
    null
  )
}

export default RefreshToken