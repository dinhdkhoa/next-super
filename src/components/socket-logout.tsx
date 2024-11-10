'use client'
import { checkPathName } from '@/constants/route-middleware'
import useLogout from '@/queries/useLogout'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAppContext } from './app-provider'
import { socket } from '@/lib/socket'
import { handleApiError } from '@/lib/utils'
import { SocketEventListener } from '@/constants/socket'

function SocketLogout() {
    const router = useRouter()
    const pathname = usePathname()
    const { isPublicPath } = checkPathName(pathname)
    const logoutMutation = useLogout()
    const { setRole } = useAppContext()

    useEffect(() => {
        if (isPublicPath) return

        if (logoutMutation.isPending || !socket.isConnected) return

        
        function onEmployeeDeleted() {
            try {
                logoutMutation.mutate(null as any, {
                    onSuccess() {
                        router.push("/login")
                        setRole()
                        socket.disconnect()
                    },
                })
            } catch (error) {
                handleApiError(error)
            }
        }

        socket.on(SocketEventListener.Logout, onEmployeeDeleted)


        return () => {
            socket.off(SocketEventListener.Logout, onEmployeeDeleted);
        }
    }, [pathname])


    return null
}

export default SocketLogout