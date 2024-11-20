'use client'
import useAuthStore, { useAuthStoreBase } from "@/hooks/zustand/useAuthStore"
import useStorePersist from "@/hooks/zustand/useStorePersist"
import { socket } from "@/lib/socket"
import StorageService from "@/lib/storage"
import { TokenPayload } from "@/types/jwt.types"
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import jwt from 'jsonwebtoken'
import { ReactNode, useEffect } from 'react'

export default function AppProvider({ children }: { children: ReactNode }) {
  const setRole = useAuthStore.use.setRole()

  useEffect(() => {
    const accessToken = StorageService.getAccessToken()
    if(accessToken){
      const jwtInfo = jwt.decode(accessToken || '') as TokenPayload
      setRole(jwtInfo?.role)
      if (!socket.isConnected) {
        socket.connect()
      }
    }
    return () => {
      socket.disconnect();
    }
  }, [])


  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

