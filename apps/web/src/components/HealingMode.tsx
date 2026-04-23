'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HEALING_MESSAGES } from '@daily-expanss/shared';
import { useState, useEffect } from 'react';

interface HealingModeProps {
  onDismiss: () => void;
}

const LEAF_COUNT = 12;

function LeafSVG({ color }: { color: string }) {
  return (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
      <path d="M12 2 C6 8, 2 16, 4 24 C6 32, 18 32, 20 24 C22 16, 18 8, 12 2Z" fill={color} opacity="0.7" />
      <path d="M12 2 L12 28" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
  );
}

export function HealingMode({ onDismiss }: HealingModeProps) {
  const [message] = useState(() => HEALING_MESSAGES[Math.floor(Math.random() * HEALING_MESSAGES.length)]);
  const leafColors = ['#C9ADA7', '#C5A065', '#a87050', '#d4956a', '#b07a5a'];

  const leaves = Array.from({ length: LEAF_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3,
    color: leafColors[i % leafColors.length],
    rotate: Math.random() * 360,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1000,
        background: 'rgba(11,12,16,0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      onClick={onDismiss}
    >
      {/* Falling leaves */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ x: `${leaf.x}vw`, y: -60, rotate: leaf.rotate, opacity: 1 }}
          animate={{ y: '110vh', rotate: leaf.rotate + 360, opacity: [1, 1, 0] }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <LeafSVG color={leaf.color} />
        </motion.div>
      ))}

      {/* Message card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(26,26,46,0.95)',
          border: '1px solid rgba(197,160,101,0.3)',
          borderRadius: 24,
          padding: '48px 40px',
          maxWidth: 460,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 24 }}>🍂</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#C5A065', fontSize: 24, marginBottom: 16 }}>
          Take a Breath
        </h2>
        <p style={{ color: '#F2E9E4', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
          {message}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          style={{ background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          Try Again 🌱
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
