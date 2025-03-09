'use client'
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import UrlList from '@/components/UrlList';
import LoadingScreen from '@/components/LoadingScreen';
import { Toaster } from 'react-hot-toast';
import { FiLogOut, FiUser, FiHeart, FiGithub } from 'react-icons/fi';

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          throw error || new Error('User not found');
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };
    
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/';
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen relative pb-16">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <nav className="border-b border-white/10 backdrop-blur-2xl bg-black/30 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            URL Shortener
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-gray-400/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <FiUser className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button
              variant="flat"
              onClick={handleLogout}
              startContent={<FiLogOut />}
              size="sm"
              className="cursor-pointer bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              Keluar
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Dashboard
            </h2>
            <p className="text-gray-400/80">
              Buat dan kelola URL pendek Anda di sini
            </p>
          </div>
          
          <UrlShortenerForm />
          <UrlList userId={user?.id} />
        </div>
      </div>

      {/* Footer Watermark */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 backdrop-blur-xl bg-black/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400/80">
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <FiHeart className="w-4 h-4 text-red-400" />
              <span>by</span>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                {/* <FiGithub className="w-4 h-4" /> */}
                <span>bimadev</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()}</span>
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                URL Shortener
              </span>
              <span>- All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-gray-800/90 !text-white !border !border-white/10 !rounded-xl !backdrop-blur-xl',
          style: {
            background: 'rgba(31, 41, 55, 0.9)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </main>
  );
} 