'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { CURRENCIES, CATEGORIES } from '@daily-expanss/shared';
import { useAppStore } from '@/store/useAppStore';
import axios from 'axios';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { selectedCurrency, setCurrency } = useAppStore();
  const [saved, setSaved] = useState(false);

  const cardStyle = { background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 20, padding: 24, marginBottom: 20 };
  const inputStyle = { background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 10, padding: '10px 14px', color: '#F2E9E4', fontSize: 13, outline: 'none' };

  const handleExportAll = async () => {
    const res = await axios.get('/api/export?format=excel', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'daily-expanss-data.xlsx';
    link.click();
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4', marginBottom: 28 }}>Settings</h1>

        {/* Profile */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16, fontSize: 18 }}>Profile</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
            {session?.user?.image ? (
              <img src={session.user.image} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid rgba(197,160,101,0.5)' }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(197,160,101,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                {session?.user?.name?.[0] ?? '?'}
              </div>
            )}
            <div>
              <p style={{ color: '#F2E9E4', fontWeight: 600 }}>{session?.user?.name ?? 'User'}</p>
              <p style={{ color: 'rgba(242,233,228,0.5)', fontSize: 13 }}>{session?.user?.email ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Currency */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16, fontSize: 18 }}>Default Currency</h3>
          <select value={selectedCurrency} onChange={(e) => setCurrency(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', width: '100%' }}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>)}
          </select>
        </div>

        {/* Budget Limits */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16, fontSize: 18 }}>Monthly Budget Limits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'rgba(242,233,228,0.6)', fontSize: 12, marginBottom: 4 }}>{cat.label}</label>
                  <input type="number" placeholder="No limit" style={{ ...inputStyle, width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            style={{ marginTop: 16, background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>
            {saved ? '✓ Saved!' : 'Save Budget Limits'}
          </motion.button>
        </div>

        {/* Data Export */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16, fontSize: 18 }}>Data & Privacy</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExportAll}
              style={{ background: 'rgba(197,160,101,0.1)', border: '1px solid rgba(197,160,101,0.3)', borderRadius: 12, padding: '12px 20px', color: '#C5A065', cursor: 'pointer', fontSize: 14 }}>
              📦 Export All Data
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ background: 'rgba(201,173,167,0.1)', border: '1px solid rgba(201,173,167,0.3)', borderRadius: 12, padding: '12px 20px', color: '#C9ADA7', cursor: 'pointer', fontSize: 14 }}>
              🗑 Delete All Data
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
