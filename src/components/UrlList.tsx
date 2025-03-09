'use client'
import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { ShortUrl } from '@/types';
import { FiCopy, FiTrash2, FiExternalLink } from 'react-icons/fi';

interface UrlListProps {
  userId: string;
}

export default function UrlList({ userId }: UrlListProps) {
  const supabase = createClientComponentClient();
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('short_urls')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUrls(data || []);
    } catch (error: any) {
      toast.error('Gagal memuat data URL');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUrls();

      // Subscribe to changes
      const channel = supabase
        .channel('table_db_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'short_urls',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('Change received!', payload);
            fetchUrls();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, supabase]);

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('URL berhasil disalin!');
    } catch (error) {
      toast.error('Gagal menyalin URL');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id); // Set ID yang sedang dihapus

      const { error } = await supabase
        .from('short_urls')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state urls secara lokal
      setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      toast.success('URL berhasil dihapus!');
    } catch (error: any) {
      toast.error('Gagal menghapus URL');
    } finally {
      setDeletingId(null); // Reset ID yang sedang dihapus
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="w-full backdrop-blur-2xl bg-white/5 border border-white/10">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center text-gray-400">Memuat data...</div>
        </CardBody>
      </Card>
    );
  }

  if (urls.length === 0) {
    return (
      <Card className="w-full backdrop-blur-2xl bg-white/5 border border-white/10">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center text-gray-400">
            Belum ada URL yang dipersingkat
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-2xl bg-white/5 border border-white/10">
      <CardBody>
        <Table 
          aria-label="Daftar URL yang dipersingkat"
          classNames={{
            wrapper: "bg-transparent",
            th: "bg-white/5 text-default-500",
            td: "border-b border-white/10"
          }}
        >
          <TableHeader>
            <TableColumn>JUDUL</TableColumn>
            <TableColumn>URL ASLI</TableColumn>
            <TableColumn>URL PENDEK</TableColumn>
            <TableColumn>KLIK</TableColumn>
            <TableColumn>KADALUARSA</TableColumn>
            <TableColumn>AKSI</TableColumn>
          </TableHeader>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.id}>
                <TableCell>{url.title || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">
                  <a 
                    href={url.original_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-400"
                  >
                    {url.original_url}
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href={`/${url.short_code}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-400"
                  >
                    {`${window.location.origin}/${url.short_code}`}
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    {url.clicks} klik
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400">
                    {url.expiration_date ? formatDate(url.expiration_date) : '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-blue-500/20 cursor-pointer text-blue-400 hover:bg-blue-500/30"
                      onClick={() => copyToClipboard(url.short_code)}
                      startContent={<FiCopy className="w-4 h-4" />}
                    >
                      Salin
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-red-500/20 cursor-pointer text-red-400 hover:bg-red-500/30"
                      onClick={() => handleDelete(url.id)}
                      isLoading={deletingId === url.id}
                      startContent={deletingId !== url.id && <FiTrash2 className="w-4 h-4" />}
                    >
                      {deletingId === url.id ? 'Menghapus...' : 'Hapus'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
} 