'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  background: 'rgba(26,26,46,0.8)',
  border: `1px solid ${hasError ? '#C9ADA7' : 'rgba(197,160,101,0.2)'}`,
  borderRadius: 12,
  padding: '12px 16px',
  color: '#F2E9E4',
  fontSize: 14,
  outline: 'none',
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/register', { name: data.name, email: data.email, password: data.password });
      await signIn('credentials', { email: data.email, password: data.password, redirect: false });
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#C5A065', marginBottom: 8 }}>
          Begin Your Journey
        </h1>
        <p style={{ color: 'rgba(242,233,228,0.6)', fontSize: 14 }}>
          Every big journey starts with a single step.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(11,12,16,0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(197,160,101,0.2)',
          borderRadius: 20,
          padding: 32,
        }}
      >
        {error && (
          <div style={{ background: 'rgba(201,173,167,0.15)', border: '1px solid rgba(201,173,167,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#C9ADA7', fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {(
            [
              { id: 'name', label: 'Your Name', type: 'text', placeholder: 'What shall we call you?', key: 'name' as const },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', key: 'email' as const },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', key: 'password' as const },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', key: 'confirmPassword' as const },
            ] as const
          ).map((field) => (
            <div key={field.id} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>{field.label}</label>
              <input
                {...register(field.key)}
                type={field.type}
                placeholder={field.placeholder}
                style={inputStyle(!!errors[field.key])}
              />
              {errors[field.key] && <p style={{ color: '#C9ADA7', fontSize: 12, marginTop: 4 }}>{errors[field.key]?.message}</p>}
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: 8 }}
          >
            {isLoading ? 'Creating your diary...' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(242,233,228,0.5)', fontSize: 13 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#C5A065', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
