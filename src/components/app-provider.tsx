'use client'
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { ReactNode } from 'react'
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export default function AppProvider({children} : {children: ReactNode}) {
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
})
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
