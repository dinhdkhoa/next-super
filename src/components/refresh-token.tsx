'use client'

import StorageService from "@/lib/storage"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import jwt from 'jsonwebtoken'
import authAPI from "@/apiRequests/auth"

const UNAUTHENTICATED_ROUTE = ['/login', '/register', '/logout', '/refresh-token']
const CHECK_VALID_TOKEN_INTERVAL = 1000 as const

function RefreshToken() {
    const pathname = usePathname()
    useEffect(() => {
        if(UNAUTHENTICATED_ROUTE.includes(pathname)) return 
        let interval : any = null

        async function checkAndRefreshToken() {
            const refreshToken = StorageService.getRefreshToken()
            const accessToken = StorageService.getAccessToken()
    
            if(!refreshToken || !accessToken) return 
    
            const decodedAT = jwt.decode(accessToken) as {exp: number, iat: number}
            const decodedRT = jwt.decode(refreshToken) as {exp: number}
    
            const now = Math.round(new Date().getTime() / 1000) // get epoch time in ms
    
            if(decodedRT.exp <= now) {
                return
            }
    
            const accessTokenDuration = decodedAT.exp - decodedAT.iat
            const accessTokenValidTimeLeft = decodedAT.exp - now
            if(accessTokenValidTimeLeft < accessTokenDuration/3){
                try {
                    await authAPI.refreshTokenClient()
                } catch (error) {
                    clearInterval(interval)
                }
            }
        }

        checkAndRefreshToken()

        interval = setInterval(checkAndRefreshToken, CHECK_VALID_TOKEN_INTERVAL)
        return() => {
            clearInterval(interval)
        }
    },[pathname])

  return (
    null
  )
}

export default RefreshToken