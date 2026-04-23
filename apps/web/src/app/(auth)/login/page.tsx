'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [bookOpen, setBookOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsLoading(false);
    if (result?.error) {
      setError('Invalid email or password. It\'s okay — try again.');
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/dashboard' });

  return (
    <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#C5A065', marginBottom: 8 }}>
          Daily Expanss
        </h1>
        <p style={{ color: 'rgba(242,233,228,0.6)', fontSize: 14 }}>
          It's okay to not be okay — your finances included.
        </p>
      </div>

      {/* Book animation */}
      <AnimatePresence mode="wait">
        {!bookOpen ? (
          <motion.div
            key="book"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setBookOpen(true)}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <motion.div
              whileHover={{ rotateY: 15, scale: 1.05 }}
              style={{ perspective: 1000, display: 'inline-block' }}
            >
              <svg width="120" height="150" viewBox="0 0 120 150">
                <rect x="10" y="10" width="100" height="130" rx="8" fill="#1A1A2E" stroke="#C5A065" strokeWidth="2" />
                <rect x="10" y="10" width="12" height="130" rx="4" fill="#C5A065" opacity="0.4" />
                <line x1="30" y1="40" x2="90" y2="40" stroke="#C5A065" strokeWidth="1" opacity="0.4" />
                <line x1="30" y1="55" x2="90" y2="55" stroke="#C5A065" strokeWidth="1" opacity="0.3" />
                <line x1="30" y1="70" x2="75" y2="70" stroke="#C5A065" strokeWidth="1" opacity="0.3" />
                <text x="60" y="105" textAnchor="middle" fill="#C5A065" fontSize="24">📖</text>
              </svg>
            </motion.div>
            <p style={{ color: '#C5A065', fontSize: 13, marginTop: 8 }}>Open your financial diary</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '100%',
              background: 'rgba(11,12,16,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(197,160,101,0.2)',
              borderRadius: 20,
              padding: 32,
            }}
          >
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 24, fontSize: 22 }}>
              Welcome Back
            </h2>

            {error && (
              <div style={{ background: 'rgba(201,173,167,0.15)', border: '1px solid rgba(201,173,167,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#C9ADA7', fontSize: 13 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 16, position: 'relative' }}>
                <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  style={{ width: '100%', background: 'rgba(26,26,46,0.8)', border: `1px solid ${errors.email ? '#C9ADA7' : 'rgba(197,160,101,0.2)'}`, borderRadius: 12, padding: '12px 16px', color: '#F2E9E4', fontSize: 14, outline: 'none' }}
                />
                {errors.email && <p style={{ color: '#C9ADA7', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              <div style={{ marginBottom: 24, position: 'relative' }}>
                <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Password</label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  style={{ width: '100%', background: 'rgba(26,26,46,0.8)', border: `1px solid ${errors.password ? '#C9ADA7' : 'rgba(197,160,101,0.2)'}`, borderRadius: 12, padding: '12px 16px', color: '#F2E9E4', fontSize: 14, outline: 'none' }}
                />
                {errors.password && <p style={{ color: '#C9ADA7', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 12 }}
              >
                {isLoading ? 'Opening your diary...' : 'Sign In'}
              </motion.button>
            </form>

            <div style={{ position: 'relative', textAlign: 'center', margin: '16px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(197,160,101,0.2)' }} />
              <span style={{ position: 'relative', background: 'rgba(11,12,16,0.8)', padding: '0 12px', color: 'rgba(242,233,228,0.4)', fontSize: 12 }}>or</span>
            </div>

            <motion.button
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 12, padding: '13px', fontSize: 14, color: '#F2E9E4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </motion.button>

            <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(242,233,228,0.5)', fontSize: 13 }}>
              New here?{' '}
              <Link href="/register" style={{ color: '#C5A065', textDecoration: 'none' }}>
                Start your journey
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
