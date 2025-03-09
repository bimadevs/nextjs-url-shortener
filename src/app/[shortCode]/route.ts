import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    shortCode: string;
  };
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest, props: Props) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Cari URL asli dan data klik saat ini
    const { data: urlData, error: fetchError } = await supabase
      .from('short_urls')
      .select('id, original_url, clicks')
      .eq('short_code', props.params.shortCode)
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

    // Update jumlah klik
    const { error: updateError } = await supabase
      .from('short_urls')
      .update({ clicks: (urlData.clicks || 0) + 1 })
      .eq('id', urlData.id);

    if (updateError) {
      console.error('Error updating clicks:', updateError);
    }

    // Redirect ke URL asli
    return NextResponse.redirect(urlData.original_url, { status: 302 });
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