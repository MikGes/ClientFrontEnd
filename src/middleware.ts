import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only run middleware on /dashboard/* routes
    if (pathname.startsWith('/Dashboard')) {
        const token = request.cookies.get('access_token')?.value
        console.log(token)
        const loginUrl = new URL('/Login', request.url)
        // if(!token)
        //     return NextResponse.redirect(loginUrl)

        // Send token to your backend to verify
        return fetch('https://back-thrumming-star-8653.fly.dev/admin/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (!data.is_authenticated) {
                    return NextResponse.redirect(loginUrl)
                }

                return NextResponse.next()
            })
            .catch(() => {
                const loginUrl = new URL('/Login', request.url)
                return NextResponse.redirect(loginUrl)
            })
    }

    return NextResponse.next()
}
export const config = {
    matcher: ['/Dashboard/:path*'],
}