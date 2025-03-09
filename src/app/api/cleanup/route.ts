import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Jalankan fungsi untuk menghapus URL yang kadaluarsa
    const { error } = await supabase
      .rpc('delete_expired_urls');

    if (error) throw error;

    return NextResponse.json({ message: 'Cleanup successful' });
  } catch (error) {
    console.error('Error in cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup expired URLs' },
      { status: 500 }
    );
  }
} 