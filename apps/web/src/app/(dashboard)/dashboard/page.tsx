'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { AntiqueLantern } from '@/components/AntiqueLantern';
import { HealingMode } from '@/components/HealingMode';
import { HealthScoreGauge } from '@/components/HealthScoreGauge';
import { TransactionCard } from '@/components/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import { useBalance } from '@/hooks/useBalance';
import { useBudgets } from '@/hooks/useBudgets';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency, CATEGORIES } from '@daily-expanss/shared';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: transactions = [] } = useTransactions();
  const { data: balance } = useBalance();
  const { data: budgets = [] } = useBudgets();
  const { isHealingModeActive, dismissHealingMode } = useAppStore();

  const currency = session?.user?.currency ?? 'BDT';
  const recentTransactions = transactions.slice(0, 5);
  const balanceRatio = balance ? Math.min((balance.balance / (balance.income || 1)), 1) : 0;
  const overBudget = budgets.some((b) => b.spent_amount > b.limit_amount);

  const cardStyle = {
    background: 'rgba(11,12,16,0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(197,160,101,0.2)',
    borderRadius: 20,
    padding: 24,
  };

  return (
    <div>
      {isHealingModeActive && <HealingMode onDismiss={dismissHealingMode} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4' }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span style={{ color: '#C5A065' }}>{session?.user?.name?.split(' ')[0] ?? 'friend'}</span>
            </h1>
            <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 14, marginTop: 4 }}>
              It's okay to take it one day at a time.
            </p>
          </div>
          <AntiqueLantern balanceRatio={Math.max(0, balanceRatio)} />
        </div>

        {/* Balance + Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div style={{ ...cardStyle, gridColumn: '1 / 2' }}>
            <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 13, marginBottom: 8 }}>Total Balance</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#C5A065', fontWeight: 700 }}>
              {balance ? formatCurrency(balance.balance, currency) : '—'}
            </p>
          </div>
          <div style={{ ...cardStyle, background: 'rgba(26,46,26,0.4)' }}>
            <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 13, marginBottom: 8 }}>🍃 Income</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#6fcf97' }}>
              {balance ? formatCurrency(balance.income, currency) : '—'}
            </p>
          </div>
          <div style={{ ...cardStyle, background: 'rgba(46,26,26,0.4)' }}>
            <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 13, marginBottom: 8 }}>🍂 Expenses</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#C9ADA7' }}>
              {balance ? formatCurrency(balance.expenses, currency) : '—'}
            </p>
          </div>
        </div>

        {/* Quick Add + Health Score */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 28 }}>
          {/* Quick Add */}
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16, fontSize: 18 }}>Quick Add</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CATEGORIES.slice(0, 6).map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/transactions/add?category=${cat.id}`)}
                  style={{ background: 'rgba(197,160,101,0.1)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 12, padding: '10px 16px', color: '#F2E9E4', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {cat.icon} {cat.label}
                </motion.button>
              ))}
            </div>
            {overBudget && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: 16, background: 'rgba(201,173,167,0.1)', border: '1px solid rgba(201,173,167,0.3)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ color: '#C9ADA7', fontSize: 13 }}>Some budgets are exceeded. That's okay. 🌿</span>
                <button onClick={() => useAppStore.getState().triggerHealingMode()} style={{ background: 'rgba(201,173,167,0.2)', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#C9ADA7', cursor: 'pointer', fontSize: 12 }}>
                  Healing Mode
                </button>
              </motion.div>
            )}
          </div>

          {/* Health Score */}
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16, fontSize: 18 }}>Financial Health</h3>
            <HealthScoreGauge score={72} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', fontSize: 18 }}>Recent Transactions</h3>
            <button onClick={() => router.push('/transactions')} style={{ background: 'none', border: 'none', color: '#C5A065', cursor: 'pointer', fontSize: 13 }}>
              View all →
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <p style={{ color: 'rgba(242,233,228,0.4)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
              No transactions yet. Start tracking your journey. 🌱
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentTransactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
