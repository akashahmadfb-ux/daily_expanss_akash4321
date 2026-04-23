'use client';

import { motion } from 'framer-motion';

interface AntiqueLanternProps {
  balanceRatio: number; // 0-1
}

export function AntiqueLantern({ balanceRatio }: AntiqueLanternProps) {
  const glowIntensity = 0.2 + balanceRatio * 0.8;
  const glowRadius = 15 + balanceRatio * 35;
  const shouldPulse = balanceRatio > 0.7;

  return (
    <motion.div
      animate={shouldPulse ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: 80, height: 100, position: 'relative' }}
    >
      <svg width="80" height="100" viewBox="0 0 80 100">
        <defs>
          <radialGradient id="lanternGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#f0c85a" stopOpacity={glowIntensity} />
            <stop offset="60%" stopColor="#C5A065" stopOpacity={glowIntensity * 0.5} />
            <stop offset="100%" stopColor="#C5A065" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow aura */}
        <ellipse cx="40" cy="65" rx={glowRadius} ry={glowRadius * 0.6} fill="url(#lanternGlow)" />

        {/* Lantern top hook */}
        <line x1="40" y1="0" x2="40" y2="12" stroke="#C5A065" strokeWidth="2" />
        <rect x="36" y="8" width="8" height="4" rx="2" fill="#C5A065" />

        {/* Lantern frame */}
        <rect x="22" y="12" width="36" height="6" rx="3" fill="#C5A065" />
        <rect x="22" y="82" width="36" height="6" rx="3" fill="#C5A065" />

        {/* Lantern glass panel */}
        <motion.rect
          x="24" y="18" width="32" height="64" rx="4"
          fill={`rgba(240, 200, 90, ${0.08 + balanceRatio * 0.15})`}
          stroke="rgba(197,160,101,0.6)"
          strokeWidth="1"
          filter="url(#glow)"
          animate={{ opacity: shouldPulse ? [0.8, 1, 0.8] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Vertical frame bars */}
        {[28, 40, 52].map((x) => (
          <line key={x} x1={x} y1="18" x2={x} y2="82" stroke="rgba(197,160,101,0.4)" strokeWidth="1" />
        ))}

        {/* Candle flame */}
        <motion.ellipse
          cx="40" cy="50" rx={6 * glowIntensity} ry={10 * glowIntensity}
          fill="#f0c85a"
          filter="url(#glow)"
          animate={{ ry: [8 * glowIntensity, 10 * glowIntensity, 8 * glowIntensity], cy: [51, 49, 51] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bottom tassel */}
        <line x1="40" y1="88" x2="40" y2="98" stroke="#C5A065" strokeWidth="2" />
        <ellipse cx="40" cy="99" rx="4" ry="3" fill="#C5A065" />
      </svg>
    </motion.div>
  );
}
