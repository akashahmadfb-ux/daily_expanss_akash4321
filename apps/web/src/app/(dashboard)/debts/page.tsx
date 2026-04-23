'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import type { Debt } from '@daily-expanss/shared';
import { formatCurrency, CURRENCIES } from '@daily-expanss/shared';
import { useSession } from 'next-auth/react';

const debtSchema = z.object({
  counterparty_name: z.string().min(1, 'Name required'),
  amount: z.number().positive(),
  currency: z.string(),
  type: z.enum(['owed_to_me', 'i_owe']),
  description: z.string().optional(),
  due_date: z.string().optional(),
});
type DebtForm = z.infer<typeof debtSchema>;

export default function DebtsPage() {
  const { data: session } = useSession();
  const currency = session?.user?.currency ?? 'BDT';
  const [activeTab, setActiveTab] = useState<'i_owe' | 'owed_to_me'>('i_owe');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: debts = [] } = useQuery<Debt[]>({
    queryKey: ['debts'],
    queryFn: async () => (await axios.get('/api/debts')).data,
  });

  const addDebt = useMutation({
    mutationFn: (data: DebtForm) => axios.post('/api/debts', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['debts'] }); setShowForm(false); },
  });

  const settleDebt = useMutation({
    mutationFn: (id: string) => axios.put(`/api/debts/${id}`, { is_settled: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<DebtForm>({
    resolver: zodResolver(debtSchema),
    defaultValues: { currency, type: activeTab },
  });

  const filtered = debts.filter((d) => d.type === activeTab && !d.is_settled);
  const cardStyle = { background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 20, padding: 24 };
  const inputStyle = { background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '10px 14px', color: '#F2E9E4', fontSize: 13, outline: 'none', width: '100%' };
  const tabStyle = (active: boolean): React.CSSProperties => ({ padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', background: active ? 'rgba(197,160,101,0.2)' : 'transparent', color: active ? '#C5A065' : 'rgba(242,233,228,0.5)', fontSize: 14 });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4' }}>Debts & Loans</h1>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
            style={{ background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {showForm ? 'Cancel' : '+ Add Entry'}
          </motion.button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(11,12,16,0.4)', padding: 6, borderRadius: 14, width: 'fit-content' }}>
          <button onClick={() => setActiveTab('i_owe')} style={tabStyle(activeTab === 'i_owe')}>I Owe</button>
          <button onClick={() => setActiveTab('owed_to_me')} style={tabStyle(activeTab === 'owed_to_me')}>Owed to Me</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ ...cardStyle, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Add Debt Entry</h3>
            <form onSubmit={handleSubmit((d) => addDebt.mutate(d))}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Person's Name</label>
                  <input {...register('counterparty_name')} placeholder="e.g., Rahim" style={inputStyle} />
                  {errors.counterparty_name && <p style={{ color: '#C9ADA7', fontSize: 12, marginTop: 4 }}>{errors.counterparty_name.message}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Amount</label>
                  <input {...register('amount', { valueAsNumber: true })} type="number" placeholder="1000" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Type</label>
                  <select {...register('type')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="i_owe">I Owe Them</option>
                    <option value="owed_to_me">They Owe Me</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Due Date</label>
                  <input {...register('due_date')} type="date" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', color: '#C5A065', fontSize: 13, marginBottom: 6 }}>Description</label>
                  <input {...register('description')} placeholder="What's it for?" style={inputStyle} />
                </div>
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ marginTop: 16, background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>
                Add Entry
              </motion.button>
            </form>
          </motion.div>
        )}

        {filtered.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
            <p style={{ color: 'rgba(242,233,228,0.6)', fontSize: 15 }}>No entries here. 🕊️ You're free!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((debt) => (
              <motion.div key={debt.id} whileHover={{ y: -2 }} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', fontSize: 18, marginBottom: 4 }}>{debt.counterparty_name}</h3>
                    {debt.description && <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 13, marginBottom: 4 }}>{debt.description}</p>}
                    {debt.due_date && <p style={{ color: 'rgba(242,233,228,0.4)', fontSize: 12 }}>🗓 Due: {new Date(debt.due_date).toLocaleDateString()}</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: debt.type === 'i_owe' ? '#C9ADA7' : '#C5A065', fontWeight: 700 }}>
                      {formatCurrency(debt.amount, debt.currency)}
                    </p>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => settleDebt.mutate(debt.id)}
                      style={{ marginTop: 8, background: 'rgba(197,160,101,0.1)', border: '1px solid rgba(197,160,101,0.3)', borderRadius: 8, padding: '6px 14px', color: '#C5A065', cursor: 'pointer', fontSize: 12 }}>
                      Settle Up ✓
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
