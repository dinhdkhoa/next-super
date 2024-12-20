import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkPathName } from './constants/route-middleware';
import jwt from 'jsonwebtoken'
import { TokenPayload } from './types/jwt.types';
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/i18n';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl

    const handleI18nRouting = createIntlMiddleware({
        locales,
        defaultLocale
    });
    
    const i18nResponse = handleI18nRouting(request)

    const {isAuthPath,isEmployeePath, isGuestPath,isPrivatePath, isPublicPath, isAuthAPIPath} = checkPathName(pathname)
    
    if(isPublicPath) return i18nResponse

    const accessToken = request.cookies.get('accessToken')
    const refreshToken = request.cookies.get('refreshToken')
    const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

    const isSignedIn = Boolean(refreshToken)

    if(!isSignedIn){
        if(isAuthPath) return i18nResponse
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url)) 
    }

    const isAccessTokenValid = Boolean(accessToken)

    //Refresh Token còn hạn nhưng access token hết hạn và vào private route
    //thì gọi reresh token mới
    if(!isAccessTokenValid && isPrivatePath){
        const redirectUrl = new URL(`/${locale}/refresh-token`, request.url)
        redirectUrl.searchParams.set('rt', request.cookies.get('refreshToken')?.value || '')
        redirectUrl.searchParams.set('returnUrl',pathname)
        return NextResponse.redirect(redirectUrl)
    }

    if(!isAccessTokenValid && isAuthAPIPath){
        return i18nResponse
    }

    //Refresh Token,access token Valid nhưng cố vào AuthPath
    if(isAuthPath){
        if(isGuestPath) return NextResponse.redirect(new URL(`/${locale}/`, request.url))
        return NextResponse.redirect(new URL(`/${locale}/manage/dashboard`, request.url))
    }

    const {role} = jwt.decode((accessToken?.value)!) as TokenPayload

    if(role == 'Guest' && !isGuestPath) return NextResponse.redirect(new URL(`/${locale}/`, request.url))
    if(role !== 'Guest' && isGuestPath) return NextResponse.redirect(new URL(`/${locale}/manage/dashboard`, request.url))
    if(role == 'Employee' && !isEmployeePath) return NextResponse.redirect(new URL(`/${locale}/manage/dashboard`, request.url))

    return i18nResponse
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/(vi|en)/:path*']
}