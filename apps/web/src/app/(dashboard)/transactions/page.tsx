'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TransactionCard } from '@/components/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import type { Category } from '@daily-expanss/shared';
import { CATEGORIES } from '@daily-expanss/shared';

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [page, setPage] = useState(1);

  const debounce = useCallback((value: string) => {
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const { data: transactions = [], isLoading } = useTransactions();

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesType = selectedType === 'all' || t.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const cardStyle = { background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 20, padding: 24 };
  const selectStyle: React.CSSProperties = { background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '8px 12px', color: '#F2E9E4', fontSize: 13, outline: 'none', cursor: 'pointer' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4' }}>Transactions</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/transactions/add')}
            style={{ background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 50, width: 48, height: 48, fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(197,160,101,0.4)' }}
          >
            +
          </motion.button>
        </div>

        {/* Filters */}
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); debounce(e.target.value); }}
              placeholder="🔍 Search transactions..."
              style={{ flex: 1, minWidth: 200, background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '8px 14px', color: '#F2E9E4', fontSize: 13, outline: 'none' }}
            />
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value as Category | 'all'); setPage(1); }} style={selectStyle}>
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value as 'all' | 'income' | 'expense'); setPage(1); }} style={selectStyle}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {/* Transaction list */}
        <div style={cardStyle}>
          {isLoading ? (
            <p style={{ color: 'rgba(242,233,228,0.4)', textAlign: 'center', padding: 20 }}>Loading transactions...</p>
          ) : paginated.length === 0 ? (
            <p style={{ color: 'rgba(242,233,228,0.4)', textAlign: 'center', padding: 20 }}>No transactions found. 🌙</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paginated.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ ...selectStyle, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
                  <span style={{ color: 'rgba(242,233,228,0.6)', fontSize: 13, alignSelf: 'center' }}>{page} / {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ ...selectStyle, opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
