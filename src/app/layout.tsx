import type { Metadata } from "next"
import { Inter as FontSans, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import AppProvider from "@/components/app-provider"
import RefreshToken from "@/components/refresh-token"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Big Boy Restaurant",
  description: "The best restaurant in the world"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          // fontSans.variable,
          inter.className
        )}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
            <RefreshToken />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
