import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./router/routes";
import { compactDecrypt, decodeJwt, jwtDecrypt, jwtVerify } from 'jose';
import Cookies from 'js-cookie';
import { jwtDecode} from "jwt-decode"; 
export async function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value;
  const auth = request.cookies.get('auth')?.value;

  if (request.nextUrl.pathname=="/auth" && !auth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if(!token && !auth){
   
    const response = NextResponse.redirect(new URL("/login", request.url));
    return response;
  }
  if (auth && !token && request.nextUrl.pathname!== "/auth") {
   
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  if(token){
    const plaintext = jwtDecode(token as string) as any;
    if (
      
      protectedRoutes.includes(request.nextUrl.pathname) &&
      (token === undefined || Date.now() > Number(plaintext.exp+'000'))
    ) {
    
      request.cookies.delete("token");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth");
      request.cookies.delete("token");
      response.cookies.delete("token");
      return response;
    }
  }


 
  if (authRoutes.includes(request.nextUrl.pathname) && token) {
    
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  

 
}

export const config = { matcher: ['/dashboard/:path*','/auth'] };
