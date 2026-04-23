'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ConstellationChart } from '@/components/ConstellationChart';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, CATEGORIES } from '@daily-expanss/shared';
import { useSession } from 'next-auth/react';
import { format, subDays, subMonths, startOfMonth } from 'date-fns';
import axios from 'axios';

type Tab = 'monthly' | 'weekly' | 'all';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('monthly');
  const { data: session } = useSession();
  const { data: transactions = [] } = useTransactions();
  const currency = session?.user?.currency ?? 'BDT';

  const now = new Date();
  const filtered = transactions.filter((t) => {
    if (activeTab === 'weekly') return new Date(t.date) >= subDays(now, 7);
    if (activeTab === 'monthly') return new Date(t.date) >= startOfMonth(now);
    return true;
  });

  const chartData = Array.from({ length: activeTab === 'weekly' ? 7 : 30 }, (_, i) => {
    const date = subDays(now, activeTab === 'weekly' ? 6 - i : 29 - i);
    const dayTxs = filtered.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    return {
      date: format(date, activeTab === 'weekly' ? 'EEE' : 'dd'),
      income: dayTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expenses: dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: filtered.filter((t) => t.category === cat.id && t.type === 'expense').reduce((s, t) => s + t.amount, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const handleExport = async (format: 'pdf' | 'excel') => {
    const response = await axios.get(`/api/export?format=${format}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `daily-expanss-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const cardStyle = { background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 20, padding: 24 };
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
    background: active ? 'rgba(197,160,101,0.2)' : 'transparent',
    color: active ? '#C5A065' : 'rgba(242,233,228,0.5)',
    fontSize: 14,
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4' }}>Reports</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleExport('pdf')} style={{ background: 'rgba(197,160,101,0.1)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '8px 16px', color: '#C5A065', cursor: 'pointer', fontSize: 13 }}>📄 PDF</button>
            <button onClick={() => handleExport('excel')} style={{ background: 'rgba(197,160,101,0.1)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '8px 16px', color: '#C5A065', cursor: 'pointer', fontSize: 13 }}>📊 Excel</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(11,12,16,0.4)', padding: 6, borderRadius: 14, width: 'fit-content' }}>
          {(['monthly', 'weekly', 'all'] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="rgba(242,233,228,0.3)" fontSize={11} />
                <YAxis stroke="rgba(242,233,228,0.3)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, color: '#F2E9E4' }} />
                <Bar dataKey="income" fill="#C5A065" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#C9ADA7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Spending Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9ADA7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9ADA7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="rgba(242,233,228,0.3)" fontSize={11} />
                <YAxis stroke="rgba(242,233,228,0.3)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, color: '#F2E9E4' }} />
                <Area type="monotone" dataKey="expenses" stroke="#C9ADA7" fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Constellation Chart */}
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>✨ Constellation of Spending</h3>
          <ConstellationChart transactions={filtered} />
        </div>

        {/* Category Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Category Breakdown</h3>
          {categoryTotals.length === 0 ? (
            <p style={{ color: 'rgba(242,233,228,0.4)', fontSize: 14 }}>No expenses in this period. 🌙</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categoryTotals.map((cat) => {
                const maxTotal = categoryTotals[0]?.total ?? 1;
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#F2E9E4', fontSize: 14 }}>{cat.icon} {cat.label}</span>
                      <span style={{ color: '#C5A065', fontSize: 14, fontWeight: 600 }}>{formatCurrency(cat.total, currency)}</span>
                    </div>
                    <div style={{ background: 'rgba(242,233,228,0.1)', borderRadius: 6, height: 8 }}>
                      <div style={{ background: 'linear-gradient(90deg, #C5A065, #a8845a)', height: '100%', width: `${(cat.total / maxTotal) * 100}%`, borderRadius: 6, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
