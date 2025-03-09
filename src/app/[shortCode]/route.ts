import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest, context: any
) {
  try {
    const shortCode = context.params.shortCode;
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Cari URL asli dan data klik saat ini
    const { data: urlData, error: fetchError } = await supabase
      .from('short_urls')
      .select('id, original_url, clicks')
      .eq('short_code', shortCode)
      .single();

    if (fetchError || !urlData) {
      console.error('Error fetching URL:', fetchError);
      return new NextResponse('URL tidak ditemukan', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Update jumlah klik menggunakan RPC untuk atomic increment
    const { error: updateError } = await supabase
      .rpc('increment_clicks', {
        url_id: urlData.id
      });

    if (updateError) {
      console.error('Error updating clicks:', updateError);
    }

    // Redirect ke URL asli dengan cache control untuk mencegah caching
    return new NextResponse(null, {
      status: 302,
      headers: {
        'Location': urlData.original_url,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error in redirect handler:', error);
    return new NextResponse('Terjadi kesalahan', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}