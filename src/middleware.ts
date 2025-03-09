import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Create a response and hand it to the supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession();

    // Log untuk debugging
    console.log('Middleware - Current path:', request.nextUrl.pathname);
    console.log('Middleware - Session:', session ? 'exists' : 'none');

    // Jika path adalah /auth/callback, biarkan proses berlanjut
    if (request.nextUrl.pathname.startsWith('/auth/callback')) {
      console.log('Middleware - Auth callback path detected');
      return res;
    }

    // Jika user tidak login dan mencoba mengakses halaman dashboard
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('Middleware - Unauthorized access to dashboard, redirecting to login');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Jika user sudah login dan mencoba mengakses halaman login
    if (session && request.nextUrl.pathname === '/') {
      console.log('Middleware - Logged in user accessing login page, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Pastikan untuk mengembalikan response yang sudah dimodifikasi
    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // Jika terjadi error, arahkan ke halaman login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Tentukan path mana saja yang akan diproses oleh middleware
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/auth/callback'
  ],
}; 