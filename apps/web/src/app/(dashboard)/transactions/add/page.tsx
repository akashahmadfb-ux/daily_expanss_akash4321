'use client';

import { AddTransactionForm } from '@/components/AddTransactionForm';
import { motion } from 'framer-motion';

export default function AddTransactionPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4', marginBottom: 28 }}>
          Add Transaction
        </h1>
        <AddTransactionForm />
      </motion.div>
    </div>
  );
}
