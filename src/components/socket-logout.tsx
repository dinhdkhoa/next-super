'use client'
import { checkPathName } from '@/constants/route-middleware'
import useLogout from '@/queries/useLogout'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import AppProvider from "@/components/app-provider"
import { socket } from '@/lib/socket'
import { handleApiError } from '@/lib/utils'
import { SocketEventListener } from '@/constants/socket'
import useAuthStore from '@/hooks/zustand/use-auth-store'

function SocketLogout() {
    const router = useRouter()
    const pathname = usePathname()
    const { isPublicPath } = checkPathName(pathname)
    const logoutMutation = useLogout()
    const setRole = useAuthStore.use.setRole()
  
    useEffect(() => {
        if (isPublicPath && pathname !== '/') return

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