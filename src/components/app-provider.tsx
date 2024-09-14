'use client'
import StorageService from "@/lib/storage"
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"


const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {}
})

export const useAppContext = () => useContext(AppContext)

export default function AppProvider({children} : {children: ReactNode}) {

const [isAuth, setIsAuthState] = useState(false)

useEffect(() => {
  const accessToken = StorageService.getAccessToken()
  if(accessToken){
    setIsAuthState(true)
  }
},[])

const setIsAuth = useCallback((isAuth: boolean) => {
  if(isAuth) {
    setIsAuthState(true)
  } else {
    setIsAuthState(false)
    StorageService.removeTokens()
  }
}, [])


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
})

  return (
   <AppContext.Provider value={{isAuth,setIsAuth}}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </AppContext.Provider>
  )
}
