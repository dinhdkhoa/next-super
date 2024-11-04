'use client'

import { checkPathName } from "@/constants/route-middleware"
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


        function onConnect() {
            console.log('Connected', socket.id)
        }

        function onDisconnect() {
            console.log(socket.id, 'Disconnected')
        }

        function onRefreshToken(data: any) {
            console.log(data)
            onCheckandRefreshToken(true)
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('refresh-token', onRefreshToken);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('refresh-token', onRefreshToken);
            clearInterval(interval)
        }
    }, [pathname, router])

    return (
        null
    )
}

export default RefreshToken