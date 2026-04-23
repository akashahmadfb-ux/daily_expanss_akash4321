'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { CATEGORIES, formatCurrency } from '@daily-expanss/shared';
import { useSession } from 'next-auth/react';

export default function CategoriesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: transactions = [] } = useTransactions();
  const { data: budgets = [] } = useBudgets();
  const currency = session?.user?.currency ?? 'BDT';

  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
  });

  const spentByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = thisMonth.filter((t) => t.category === cat.id).reduce((s, t) => s + t.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4', marginBottom: 28 }}>
          Categories
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {CATEGORIES.map((cat) => {
            const spent = spentByCategory[cat.id] ?? 0;
            const budget = budgets.find((b) => b.category === cat.id);
            const limitAmount = budget?.limit_amount ?? 0;
            const progress = limitAmount > 0 ? Math.min((spent / limitAmount) * 100, 100) : 0;
            const isOverBudget = limitAmount > 0 && spent > limitAmount;

            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => router.push(`/transactions?category=${cat.id}`)}
                style={{ background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: `1px solid ${isOverBudget ? 'rgba(201,173,167,0.4)' : 'rgba(197,160,101,0.2)'}`, borderRadius: 20, padding: 24, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 6, fontSize: 18 }}>{cat.label}</h3>
                <p style={{ color: isOverBudget ? '#C9ADA7' : '#C5A065', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                  {formatCurrency(spent, currency)}
                </p>
                {budget && (
                  <>
                    <div style={{ background: 'rgba(242,233,228,0.1)', borderRadius: 6, height: 6, marginBottom: 6, overflow: 'hidden' }}>
                      <div style={{ background: isOverBudget ? '#C9ADA7' : '#C5A065', height: '100%', width: `${progress}%`, borderRadius: 6, transition: 'width 0.5s ease' }} />
                    </div>
                    <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 12 }}>
                      {formatCurrency(spent, currency)} / {formatCurrency(limitAmount, currency)} budget
                    </p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
