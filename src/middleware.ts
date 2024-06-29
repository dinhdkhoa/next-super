import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const authPaths = ['/login', '/register']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const accessToken = Boolean(request.cookies.get('accessToken'))

    if ( (pathname.includes('/edit') || pathname.includes('/add')) && !accessToken){
        return NextResponse.redirect(new URL(`/login/?returnUrl=${pathname}`, request.url))
    }

    if (privatePath.some(path => path.startsWith(pathname)) && !accessToken){
        return NextResponse.redirect(new URL(`/login/?returnUrl=${pathname}`, request.url))
    }
    if (authPaths.some(path => path.startsWith(pathname)) && accessToken){
        return NextResponse.redirect(new URL('/me', request.url))
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*'
}