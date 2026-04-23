'use client';

import { motion } from 'framer-motion';

interface TreeProgressProps {
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  size?: number;
}

const stageColors = {
  0: { trunk: '#4a3728', foliage: null, label: 'Bare' },
  1: { trunk: '#6b4a32', foliage: '#8B6355', label: 'Budding' },
  2: { trunk: '#6b4a32', foliage: '#5a7a4a', label: 'Sprouting' },
  3: { trunk: '#7a5840', foliage: '#2d6a4f', label: 'Growing' },
  4: { trunk: '#7a5840', foliage: '#C9ADA7', label: 'Flowering' },
  5: { trunk: '#7a5840', foliage: '#C5A065', label: 'Blooming' },
};

export function TreeProgress({ stage, size = 120 }: TreeProgressProps) {
  const colors = stageColors[stage];
  const scale = size / 120;

  const treeParts = () => {
    const trunk = (
      <rect key="trunk" x="54" y="80" width="12" height="30" rx="3" fill={colors.trunk} />
    );

    if (stage === 0) {
      return [
        trunk,
        <line key="branch-l" x1="60" y1="65" x2="35" y2="45" stroke={colors.trunk} strokeWidth="3" strokeLinecap="round" />,
        <line key="branch-r" x1="60" y1="65" x2="85" y2="48" stroke={colors.trunk} strokeWidth="3" strokeLinecap="round" />,
        <line key="branch-tl" x1="35" y1="45" x2="22" y2="32" stroke={colors.trunk} strokeWidth="2" strokeLinecap="round" />,
        <line key="branch-tr" x1="85" y1="48" x2="96" y2="34" stroke={colors.trunk} strokeWidth="2" strokeLinecap="round" />,
      ];
    }

    if (stage === 1) {
      return [
        trunk,
        <ellipse key="bud1" cx="30" cy="50" rx="8" ry="8" fill={colors.foliage!} opacity={0.6} />,
        <ellipse key="bud2" cx="90" cy="50" rx="8" ry="8" fill={colors.foliage!} opacity={0.6} />,
        <ellipse key="bud3" cx="60" cy="40" rx="8" ry="8" fill={colors.foliage!} opacity={0.7} />,
      ];
    }

    if (stage === 2) {
      return [
        trunk,
        <ellipse key="canopy-l" cx="38" cy="55" rx="18" ry="16" fill={colors.foliage!} opacity={0.7} />,
        <ellipse key="canopy-r" cx="82" cy="55" rx="18" ry="16" fill={colors.foliage!} opacity={0.7} />,
        <ellipse key="canopy-c" cx="60" cy="45" rx="20" ry="18" fill={colors.foliage!} opacity={0.8} />,
      ];
    }

    if (stage === 3) {
      return [
        trunk,
        <ellipse key="canopy-l" cx="35" cy="52" rx="22" ry="20" fill={colors.foliage!} />,
        <ellipse key="canopy-r" cx="85" cy="52" rx="22" ry="20" fill={colors.foliage!} />,
        <ellipse key="canopy-c" cx="60" cy="40" rx="28" ry="24" fill={colors.foliage!} />,
        <ellipse key="canopy-t" cx="60" cy="28" rx="18" ry="16" fill={colors.foliage!} />,
      ];
    }

    if (stage === 4) {
      return [
        trunk,
        <ellipse key="canopy-main" cx="60" cy="45" rx="32" ry="30" fill="#2d6a4f" />,
        ...[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 24 + Math.random() * 10;
          return <circle key={`flower-${i}`} cx={60 + r * Math.cos(angle)} cy={45 + r * Math.sin(angle)} r={5} fill={colors.foliage!} opacity={0.85} />;
        }),
      ];
    }

    // Stage 5: Full bloom
    return [
      trunk,
      <ellipse key="canopy-main" cx="60" cy="44" rx="34" ry="32" fill="#2d6a4f" />,
      ...[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const r = 26 + (i % 3) * 6;
        return <circle key={`flower-${i}`} cx={60 + r * Math.cos(angle)} cy={44 + r * Math.sin(angle)} r={6} fill={colors.foliage!} opacity={0.9} />;
      }),
      ...[...Array(5)].map((_, i) => (
        <motion.circle
          key={`firefly-${i}`}
          cx={40 + i * 10}
          cy={30 + (i % 3) * 15}
          r={2}
          fill="#f0c85a"
          animate={{ opacity: [0.2, 1, 0.2], cy: [30 + (i % 3) * 15, 25 + (i % 3) * 15, 30 + (i % 3) * 15] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )),
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg width={size} height={size * 0.9} viewBox="0 0 120 120" transform={`scale(${scale})`}>
        {treeParts()}
      </svg>
      <span style={{ color: 'rgba(242,233,228,0.5)', fontSize: 11, fontFamily: 'Poppins, sans-serif', marginTop: 4 }}>
        {colors.label}
      </span>
    </motion.div>
  );
}
