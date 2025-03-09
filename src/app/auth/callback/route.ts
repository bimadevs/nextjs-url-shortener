import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    console.log('Auth callback - Code received:', code ? 'exists' : 'none');

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      console.log('Auth callback - Exchanging code for session');
      await supabase.auth.exchangeCodeForSession(code);
      console.log('Auth callback - Session exchange successful');
    }

    // Redirect to dashboard
    console.log('Auth callback - Redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect to login page if there's an error
    return NextResponse.redirect(new URL('/', request.url));
  }
} 