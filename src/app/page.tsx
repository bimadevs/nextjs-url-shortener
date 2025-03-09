import AuthForm from '@/components/AuthForm';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="text-center mb-12 space-y-6 max-w-3xl relative animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
          URL Shortener
        </h1>
        <p className="text-lg md:text-xl text-gray-300/80 leading-relaxed max-w-2xl mx-auto">
          Perpendek URL Anda dengan mudah dan cepat. Dilengkapi dengan fitur pelacakan klik dan manajemen link yang lengkap.
        </p>
      </div>
      
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
        <AuthForm />
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-6 text-center text-gray-400/80 backdrop-blur-xl bg-black/20 border-t border-white/5">
        <p className="text-sm">© {new Date().getFullYear()} URL Shortener. Dibuat dengan ❤️</p>
      </footer>
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: '!bg-gray-800/90 !text-white !border !border-white/10 !rounded-xl !backdrop-blur-xl',
          duration: 4000,
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
