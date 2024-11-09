'use client'

import { checkPathName } from "@/constants/route-middleware"
import { SocketEventListener } from "@/constants/socket"
import { socket } from "@/lib/socket"
import { checkAndRefreshToken } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const CHECK_VALID_TOKEN_INTERVAL = 1000 as const

function RefreshToken() {
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        if (checkPathName(pathname).isPublicPath || checkPathName(pathname).isAuthPath) return
        let interval: any = null

        const onCheckandRefreshToken = (force?: boolean) => checkAndRefreshToken(undefined, () => {
            clearInterval(interval)
            router.push('/login')}, force)

        onCheckandRefreshToken()

        interval = setInterval(onCheckandRefreshToken, CHECK_VALID_TOKEN_INTERVAL)

        function onRefreshToken() {
            onCheckandRefreshToken(true)
            window.location.reload()    
        }

        socket.on(SocketEventListener.RefreshToken, onRefreshToken);

        return () => {
            socket.off(SocketEventListener.RefreshToken, onRefreshToken);
            clearInterval(interval)
        }
    }, [pathname, router])

    return (
        null
    )
}

export default RefreshToken