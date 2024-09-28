import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkPathName } from './constants/route-middleware';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl

    const {isAuthPath,isEmployeePath, isGuestPath,isPrivatePath, isPublicPath} = checkPathName(pathname)
    
    if(isPublicPath) return NextResponse.next()

    const accessToken = request.cookies.get('accessToken')
    const refreshToken = request.cookies.get('refreshToken')

    const isSignedIn = Boolean(refreshToken)

    if(!isSignedIn){
        if(isAuthPath) return NextResponse.next()
        return NextResponse.redirect(new URL('/login', request.url)) 
    }

    const isAccessTokenValid = Boolean(accessToken)

    //Refresh Token còn hạn nhưng access token hết hạn và vào private route
    //thì gọi reresh token mới
    if(!isAccessTokenValid && isPrivatePath){
        const redirectUrl = new URL('/refresh-token', request.url)
        redirectUrl.searchParams.set('rt', request.cookies.get('refreshToken')?.value || '')
        redirectUrl.searchParams.set('returnUrl',pathname)
        return NextResponse.redirect(redirectUrl)
    }

    //Refresh Token,access token Valid nhưng cố vào AuthPath
    if(isAuthPath){
        if(isGuestPath) return NextResponse.redirect(new URL('/', request.url))
        return NextResponse.redirect(new URL('/manage/dashboard', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*'
}