import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkPathName } from './constants/route-middleware';
import jwt from 'jsonwebtoken'
import { TokenPayload } from './types/jwt.types';
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/i18n';
import { headers } from 'next/headers';



// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl

    const handleI18nRouting = createIntlMiddleware({
        locales,
        defaultLocale
    });

    const i18nResponse = handleI18nRouting(request)

    const {isAuthPath,isEmployeePath, isGuestPath,isPrivatePath, isPublicPath, isAuthAPIPath} = checkPathName(pathname)
    
    // if(isPublicPath) return NextResponse.next()
    if(isPublicPath) return i18nResponse

    const accessToken = request.cookies.get('accessToken')
    const refreshToken = request.cookies.get('refreshToken')

    const isSignedIn = Boolean(refreshToken)

    if(!isSignedIn){
        // if(isAuthPath) return NextResponse.next()
        if(isAuthPath) return i18nResponse
        // return NextResponse.redirect(new URL('/login', request.url)) 
        i18nResponse.headers.set('x-middleware-rewrite', new URL('/login', request.url).toString())
        return i18nResponse
    }

    const isAccessTokenValid = Boolean(accessToken)

    //Refresh Token còn hạn nhưng access token hết hạn và vào private route
    //thì gọi reresh token mới
    if(!isAccessTokenValid && isPrivatePath){
        const redirectUrl = new URL('/refresh-token', request.url)
        redirectUrl.searchParams.set('rt', request.cookies.get('refreshToken')?.value || '')
        redirectUrl.searchParams.set('returnUrl',pathname)
        // return NextResponse.redirect(redirectUrl)
        i18nResponse.headers.set('x-middleware-rewrite', redirectUrl.toString())
        return i18nResponse
    }

    if(!isAccessTokenValid && isAuthAPIPath){
        return i18nResponse
        // return NextResponse.next()
    }

    //Refresh Token,access token Valid nhưng cố vào AuthPath
    if(isAuthPath){
        // if(isGuestPath) return NextResponse.redirect(new URL('/', request.url))
        if(isGuestPath){
            i18nResponse.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            return i18nResponse
        }
        // return NextResponse.redirect(new URL('/manage/dashboard', request.url))
        i18nResponse.headers.set('x-middleware-rewrite', new URL('/manage/dashboard', request.url).toString())
        return i18nResponse
    }

    const {role} = jwt.decode((accessToken?.value)!) as TokenPayload

    // if(role == 'Guest' && !isGuestPath) return NextResponse.redirect(new URL('/', request.url))
    // if(role !== 'Guest' && isGuestPath) return NextResponse.redirect(new URL('/manage/dashboard', request.url))
    // if(role == 'Employee' && !isEmployeePath) return NextResponse.redirect(new URL('/manage/dashboard', request.url))
    if (role == 'Guest' && !isGuestPath) {
        i18nResponse.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
        return i18nResponse
    }
    
    if (role !== 'Guest' && isGuestPath) {
        i18nResponse.headers.set('x-middleware-rewrite', new URL('/manage/dashboard', request.url).toString())
        return i18nResponse
    }
    
    if (role == 'Employee' && !isEmployeePath) {
        i18nResponse.headers.set('x-middleware-rewrite', new URL('/manage/dashboard', request.url).toString())
        return i18nResponse
    }
    

    // return NextResponse.next()
    return i18nResponse
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/(de|en)/:path*']
}