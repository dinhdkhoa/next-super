import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import AppProvider from "@/components/app-provider"
import RefreshToken from "@/components/refresh-token"
import SocketLogout from "@/components/socket-logout"
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import NextTopLoader from 'nextjs-toploader';
import Footer from "@/components/footer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})
export const metadata: Metadata = {
  title: "Big Boy Restaurant",
  description: "The best restaurant in the world"
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode,
    params: {locale: string}
  }>
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);
  // const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextTopLoader showSpinner={false} color="hsl(var(--foreground))" crawlSpeed={200} speed={200}/>
        <NextIntlClientProvider messages={messages}>
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
              <SocketLogout />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>

      </body>
    </html>
  )
}
