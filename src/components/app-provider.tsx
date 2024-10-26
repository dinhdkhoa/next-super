'use client'
import StorageService from "@/lib/storage"
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RoleType, TokenPayload } from "@/types/jwt.types"
import jwt from 'jsonwebtoken'


const AppContext = createContext<{
  setRole: (role?: RoleType) => void,
  isAuth: boolean,
  role?: RoleType
}>({
  isAuth: false,
  role: undefined ,
  setRole: (role?: RoleType) => {}
})

export const useAppContext = () => useContext(AppContext)

export default function AppProvider({children} : {children: ReactNode}) {

const [role, setRoleState] = useState<RoleType | undefined>(undefined)

useEffect(() => {
  const accessToken = StorageService.getAccessToken()
  if(accessToken){
    const jwtInfo = jwt.decode(accessToken) as TokenPayload
    setRoleState(jwtInfo.role)
  } 
},[])

const setRole = useCallback((role?: RoleType) => {
  if(role) {
    setRoleState(role)
  } else {
    setRoleState(undefined)
    StorageService.removeTokens()
  }
}, [])

const isAuth = Boolean(role)

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
})

  return (
   <AppContext.Provider value={{isAuth,setRole,role}}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </AppContext.Provider>
  )
}
