'use client'
import { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import { toast } from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiClock } from 'react-icons/fi';

export default function UrlShortenerForm() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [useCustomCode, setUseCustomCode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    original_url: '',
    custom_code: '',
    title: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, [supabase.auth]);

  const validateCustomCode = (code: string) => {
    const regex = /^[a-zA-Z0-9-]+$/;
    if (!regex.test(code)) {
      throw new Error('Kode kustom hanya boleh mengandung huruf, angka, dan tanda hubung (-)');
    }
    if (code.length < 3) {
      throw new Error('Kode kustom minimal 3 karakter');
    }
    if (code.length > 20) {
      throw new Error('Kode kustom maksimal 20 karakter');
    }
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
    } catch {
      throw new Error('URL tidak valid. Pastikan URL dimulai dengan http:// atau https://');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) {
        throw new Error('Silakan login terlebih dahulu');
      }

      // Validasi URL
      validateUrl(formData.original_url);

      const shortCode = useCustomCode ? formData.custom_code : nanoid(6);

      // Validasi kode kustom jika digunakan
      if (useCustomCode) {
        validateCustomCode(formData.custom_code);

        // Cek apakah kode sudah digunakan
        const { data: existingUrl } = await supabase
          .from('short_urls')
          .select('id')
          .eq('short_code', formData.custom_code)
          .single();

        if (existingUrl) {
          throw new Error('Kode kustom sudah digunakan. Silakan pilih kode lain');
        }
      }
      
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const { error } = await supabase
        .from('short_urls')
        .insert([
          {
            original_url: formData.original_url,
            short_code: shortCode,
            title: formData.title || null,
            clicks: 0,
            is_custom: useCustomCode,
            user_id: userId,
            expiration_date: expirationDate.toISOString(),
          },
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint error
          throw new Error('Kode kustom sudah digunakan. Silakan pilih kode lain');
        }
        throw error;
      }

      toast.success('URL berhasil dipersingkat!', {
        duration: 3000,
        position: 'bottom-right',
      });
      
      setFormData({ original_url: '', custom_code: '', title: '' });
      setUseCustomCode(false);
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan. Silakan coba lagi', {
        duration: 4000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-2xl bg-white/5 border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      <CardHeader className="relative flex flex-col gap-2 p-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Persingkat URL Anda
        </h2>
        <div className="flex items-center gap-2 text-red-400/80 text-sm">
          <FiClock className="w-4 h-4" />
          <span>URL akan otomatis kadaluarsa setelah 1 bulan</span>
        </div>
      </CardHeader>
      <CardBody className="relative p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">URL Asli</p>
            <input
              type="url"
              placeholder="https://example.com/long-url"
              value={formData.original_url}
              onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Judul (Opsional)</p>
            <input
              type="text"
              placeholder="Berikan judul untuk URL ini"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          <div 
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200"
            onClick={() => setUseCustomCode(!useCustomCode)}
          >
            <div className="relative">
              <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${useCustomCode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-600'}`}>
                <div 
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${useCustomCode ? 'translate-x-4' : ''}`}
                />
              </div>
            </div>
            <span className="text-sm text-white">Gunakan Custom Alias</span>
          </div>

          {useCustomCode && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-sm font-medium text-primary">Custom Alias</p>
              <input
                type="text"
                placeholder="custom alias"
                value={formData.custom_code}
                onChange={(e) => setFormData({ ...formData, custom_code: e.target.value.toLowerCase() })}
                pattern="[a-zA-Z0-9-]+"
                minLength={3}
                maxLength={20}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required={useCustomCode}
              />
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Persyaratan Custom Alias:</p>
                <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                  <li>Hanya boleh mengandung huruf, angka, dan tanda hubung (-)</li>
                  <li>Minimal 3 karakter</li>
                  <li>Maksimal 20 karakter</li>
                  <li>Tidak boleh sama dengan alias yang sudah ada</li>
                </ul>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white shadow-lg shadow-purple-500/20 h-12 rounded-xl hover:opacity-90 transition-opacity"
            isLoading={loading}
            size="lg"
          >
            {loading ? 'Memproses...' : 'Persingkat URL'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
} 