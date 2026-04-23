'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TreeProgress } from '@/components/TreeProgress';
import { formatCurrency, getTreeStage, CURRENCIES } from '@daily-expanss/shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { SavingsGoal } from '@daily-expanss/shared';
import { useSession } from 'next-auth/react';

const goalSchema = z.object({
  title: z.string().min(2, 'Title required'),
  target_amount: z.number().positive('Amount must be positive'),
  currency: z.string(),
  deadline: z.string().optional(),
});
type GoalForm = z.infer<typeof goalSchema>;

export default function SavingsPage() {
  const { data: session } = useSession();
  const currency = session?.user?.currency ?? 'BDT';
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery<SavingsGoal[]>({
    queryKey: ['savings-goals'],
    queryFn: async () => (await axios.get('/api/savings-goals')).data,
  });

  const addGoal = useMutation({
    mutationFn: (data: GoalForm) => axios.post('/api/savings-goals', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['savings-goals'] }); setShowForm(false); },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: { currency },
  });

  const cardStyle = { background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 20, padding: 24 };
  const inputStyle = { background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '10px 14px', color: '#F2E9E4', fontSize: 13, outline: 'none', width: '100%' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4' }}>Savings Goals</h1>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
            style={{ background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {showForm ? 'Cancel' : '+ New Goal'}
          </motion.button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ ...cardStyle, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Plant a New Seed ��</h3>
            <form onSubmit={handleSubmit((d) => addGoal.mutate(d))}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Goal Title</label>
                  <input {...register('title')} placeholder="e.g., New Laptop" style={inputStyle} />
                  {errors.title && <p style={{ color: '#C9ADA7', fontSize: 12, marginTop: 4 }}>{errors.title.message}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Target Amount</label>
                  <input {...register('target_amount', { valueAsNumber: true })} type="number" placeholder="50000" style={inputStyle} />
                  {errors.target_amount && <p style={{ color: '#C9ADA7', fontSize: 12, marginTop: 4 }}>{errors.target_amount.message}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Currency</label>
                  <select {...register('currency')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Deadline (optional)</label>
                  <input {...register('deadline')} type="date" style={inputStyle} />
                </div>
              </div>
              <motion.button type="submit" disabled={addGoal.isPending} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ marginTop: 16, background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>
                {addGoal.isPending ? 'Planting...' : 'Plant This Seed 🌱'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {goals.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌰</div>
            <p style={{ color: 'rgba(242,233,228,0.6)', fontSize: 15 }}>No savings goals yet. Plant a seed and watch it grow. 🌱</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {goals.map((goal) => {
              const stage = getTreeStage(goal.current_amount, goal.target_amount);
              const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
              const isNearComplete = progress >= 80;
              return (
                <motion.div key={goal.id} whileHover={{ y: -4 }} style={{ ...cardStyle, border: `1px solid ${isNearComplete ? 'rgba(197,160,101,0.5)' : 'rgba(197,160,101,0.2)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <TreeProgress stage={stage} />
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', fontSize: 18, marginBottom: 8 }}>{goal.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: '#C5A065', fontWeight: 700 }}>{formatCurrency(goal.current_amount, goal.currency)}</span>
                    <span style={{ color: 'rgba(242,233,228,0.5)', fontSize: 13 }}>of {formatCurrency(goal.target_amount, goal.currency)}</span>
                  </div>
                  <div style={{ background: 'rgba(242,233,228,0.1)', borderRadius: 8, height: 8, overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ background: isNearComplete ? 'linear-gradient(90deg, #C5A065, #f0c85a)' : 'linear-gradient(90deg, #C5A065, #a8845a)', height: '100%', borderRadius: 8 }}
                    />
                    {isNearComplete && (
                      <div className="animate-firefly" style={{ position: 'absolute', right: 4, top: -2, width: 12, height: 12, borderRadius: '50%', background: '#f0c85a', boxShadow: '0 0 8px #f0c85a' }} />
                    )}
                  </div>
                  <p style={{ color: 'rgba(242,233,228,0.4)', fontSize: 12, marginTop: 6, textAlign: 'right' }}>{progress.toFixed(1)}% complete</p>
                  {goal.deadline && (
                    <p style={{ color: 'rgba(242,233,228,0.4)', fontSize: 12, marginTop: 4 }}>🗓 Due: {new Date(goal.deadline).toLocaleDateString()}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
