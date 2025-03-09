'use client'
import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { FiLogIn, FiUserPlus, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTab, setSelectedTab] = useState('login');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success('Login berhasil!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Password tidak cocok');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
        setSelectedTab('login');
        setPassword('');
        setConfirmPassword('');
      } else if (data.session) {
        toast.success('Registrasi berhasil!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal registrasi');
    } finally {
      setLoading(false);
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <Card className="w-full bg-white/5 backdrop-blur-2xl border border-white/10">
      <CardHeader className="flex flex-col gap-3 items-center p-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Selamat Datang
        </h2>
        <p className="text-sm text-gray-400/80">
          Masuk atau daftar untuk mulai memendekkan URL
        </p>
      </CardHeader>
      <CardBody className="px-6 pb-8">
        <Tabs 
          aria-label="Auth options" 
          className="w-full"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key.toString())}
          classNames={{
            tabList: "gap-4 w-full relative rounded-full p-1 border border-white/10 bg-white/5",
            cursor: "bg-white/10 rounded-full backdrop-blur-xl",
            tab: "data-[selected=true]:text-white text-gray-400/80 h-10",
            tabContent: "group-data-[selected=true]:text-white"
          }}
        >
          <Tab
            key="login"
            title={
              <div className="flex items-center gap-2">
                <FiLogIn className="text-lg" />
                <span>Masuk</span>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="login-form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleLogin} className="space-y-6 py-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Email</p>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Password</p>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white shadow-lg shadow-purple-500/20 h-12 rounded-xl hover:opacity-90 transition-opacity"
                    isLoading={loading}
                    size="lg"
                  >
                    {loading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>
          </Tab>
          <Tab
            key="register"
            title={
              <div className="flex items-center gap-2">
                <FiUserPlus className="text-lg" />
                <span>Daftar</span>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="register-form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleRegister} className="space-y-6 py-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Email</p>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Password</p>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Konfirmasi Password</p>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                    {passwordError && (
                      <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                        <FiAlertCircle className="w-4 h-4" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Persyaratan password:</p>
                    <ul className="text-xs text-gray-400 list-disc list-inside">
                      <li>Minimal 6 karakter</li>
                      <li>Password dan konfirmasi harus sama</li>
                    </ul>
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white shadow-lg shadow-purple-500/20 h-12 rounded-xl hover:opacity-90 transition-opacity"
                    isLoading={loading}
                    size="lg"
                  >
                    {loading ? 'Memproses...' : 'Daftar'}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
} 