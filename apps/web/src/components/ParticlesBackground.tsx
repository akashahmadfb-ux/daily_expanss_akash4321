'use client';

import { useCallback, lazy, Suspense } from 'react';
import type { Engine } from '@tsparticles/engine';

// Dynamic import to avoid SSR issues
const Particles = lazy(() => import('@tsparticles/react').then((m) => ({ default: m.default ?? m.Particles })));

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    const { loadSlim } = await import('@tsparticles/slim');
    await loadSlim(engine);
  }, []);

  const options = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 30,
    particles: {
      number: { value: 40, density: { enable: true, area: 900 } },
      color: { value: ['#C5A065', '#f0c85a', '#F2E9E4'] },
      opacity: {
        value: { min: 0.1, max: 0.7 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 1, minimumValue: 0.5, sync: false },
      },
      move: {
        enable: true,
        speed: { min: 0.2, max: 0.8 },
        direction: 'none' as const,
        random: true,
        straight: false,
        outModes: { default: 'out' as const },
        warp: false,
      },
      twinkle: {
        particles: { enable: true, frequency: 0.05, opacity: 1 },
      },
    },
    detectRetina: true,
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Suspense fallback={null}>
        <Particles
          id="firefly-particles"
          init={particlesInit}
          options={options}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
}
