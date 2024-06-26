import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { NextResponse } from "next/server"
  
const { auth } = NextAuth(authConfig)

const apiAuthPrefix = "/api/auth";
const authRoutes = [
    "/auth/login",
    "/auth/error",
  ];
const DEFAULT_LOGIN_REDIRECT = "/";  

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    // console.log('isLoggedIn', isLoggedIn)

    const publicDomain= process.env.NEXT_PUBLIC_URL?.split('//')[1]
    let hostname = req.headers
    let subdomain = hostname.get('host')?.split(`${publicDomain}`).filter(Boolean)[0]

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    //console.log('nextUrl', nextUrl.pathname);    
    
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
    if (isApiAuthRoute) {
      return
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return
    }

    if (!isLoggedIn) {

        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = (callbackUrl && callbackUrl !== "/") ? "?callbackUrl=" + encodeURIComponent(callbackUrl) : "";

        return Response.redirect(new URL(`/auth/login${encodedCallbackUrl}`, nextUrl))
    }

    if (subdomain) {
        const searchParams = nextUrl.searchParams.toString()
        const path = nextUrl.pathname
        if (path.startsWith("/auth"))
            return
        
        console.log('path', path)
        
        const newPath = "/" + path.split('/').filter(Boolean).slice(1).join('/')
        console.log('newPath', newPath)        
        const pathWithSearchParams = `${newPath}${searchParams.length > 0 ? `?${searchParams}` : ''}`
        console.log('pathWithSearchParams', pathWithSearchParams)

        subdomain= subdomain.substring(0, subdomain.length - 1)
        console.log('subdomain', subdomain)
        // const newUrl = `/${subdomain}${pathWithSearchParams}`
        // console.log('newUrl', newUrl)
        
        // return NextResponse.rewrite(new URL(`/${subdomain}${pathWithSearchParams}`, req.url))
    }
    

    return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}