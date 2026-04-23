'use client';

import { motion } from 'framer-motion';

interface HealthScoreGaugeProps {
  score: number; // 0-100
}

function getColor(score: number): string {
  if (score >= 70) return '#C5A065';
  if (score >= 40) return '#C9ADA7';
  return '#a05050';
}

export function HealthScoreGauge({ score }: HealthScoreGaugeProps) {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Use 75% of circle for the gauge arc (start at 135deg, end at 45deg)
  const arcLength = circumference * 0.75;
  const fillLength = arcLength * (score / 100);
  const color = getColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(135deg)' }}>
          {/* Background arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(242,233,228,0.1)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${fillLength} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${fillLength} ${circumference}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color }}
          >
            {score}
          </motion.span>
          <span style={{ display: 'block', color: 'rgba(242,233,228,0.5)', fontSize: 10, fontFamily: 'Poppins, sans-serif' }}>/ 100</span>
        </div>
      </div>
      <span style={{ color: 'rgba(242,233,228,0.6)', fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>
        {score >= 70 ? '✨ Excellent' : score >= 40 ? '🌿 Growing' : '🌱 Needs Care'}
      </span>
    </div>
  );
}
