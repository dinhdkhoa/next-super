import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const authPaths = ['/login', '/register', '/logout']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const accessToken = Boolean(request.cookies.get('accessToken'))
    const refreshToken = Boolean(request.cookies.get('refreshToken'))

    if (privatePath.some(path => pathname.startsWith(path)) && !accessToken && !refreshToken) {
        return NextResponse.redirect(new URL(`/login/?returnUrl=${pathname}`, request.url))
    }

    if (authPaths.some(path => pathname.startsWith(path)) && accessToken && refreshToken) {
        return NextResponse.redirect(new URL('/manage/dashboard', request.url))
    }

    
    if (privatePath.some(path => pathname.startsWith(path)) && !accessToken && refreshToken ){
        const redirectUrl = new URL('/logout', request.url)
        redirectUrl.searchParams.set('rt', request.cookies.get('refreshToken')?.value || '')
        return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*'
}