'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { HealthScoreGauge } from '@/components/HealthScoreGauge';
import { StreakCounter } from '@/components/StreakCounter';
import { Badge } from '@daily-expanss/ui';
import { useSession } from 'next-auth/react';
import type { AIInsight } from '@daily-expanss/shared';
import { BADGE_DEFINITIONS, LEVEL_THRESHOLDS } from '@daily-expanss/shared';

const insightTypeStyles: Record<AIInsight['type'], { bg: string; border: string; icon: string }> = {
  tip: { bg: 'rgba(197,160,101,0.1)', border: 'rgba(197,160,101,0.3)', icon: '💡' },
  warning: { bg: 'rgba(201,173,167,0.1)', border: 'rgba(201,173,167,0.3)', icon: '🌿' },
  encouragement: { bg: 'rgba(26,46,26,0.3)', border: 'rgba(111,207,151,0.2)', icon: '🌱' },
  achievement: { bg: 'rgba(197,160,101,0.15)', border: 'rgba(197,160,101,0.4)', icon: '🏆' },
};

export default function InsightsPage() {
  const { data: session } = useSession();
  const [weeklyTip, setWeeklyTip] = useState<string | null>(null);

  const { data: insights = [], refetch, isFetching } = useQuery<AIInsight[]>({
    queryKey: ['insights'],
    queryFn: async () => (await axios.post('/api/insights')).data,
    enabled: false,
  });

  const getWeeklyTip = useMutation({
    mutationFn: async () => (await axios.get('/api/insights?type=tip')).data.tip as string,
    onSuccess: (tip) => setWeeklyTip(tip),
  });

  const user = session?.user;
  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;
  const currentLevelData = LEVEL_THRESHOLDS[level - 1] ?? LEVEL_THRESHOLDS[0];
  const nextLevelData = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpProgress = ((xp - currentLevelData.xp) / (nextLevelData.xp - currentLevelData.xp)) * 100;

  const cardStyle = { background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(197,160,101,0.2)', borderRadius: 20, padding: 24 };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#F2E9E4', marginBottom: 28 }}>AI Insights</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Health Score */}
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Financial Health</h3>
            <HealthScoreGauge score={72} />
          </div>

          {/* Streak + XP */}
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 16 }}>Your Journey</h3>
            <StreakCounter streak={user?.streak ?? 0} />
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'rgba(242,233,228,0.6)', fontSize: 13 }}>Level {level} — {currentLevelData.title}</span>
                <span style={{ color: '#C5A065', fontSize: 13 }}>{xp} XP</span>
              </div>
              <div style={{ background: 'rgba(242,233,228,0.1)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(xpProgress, 100))}%` }} transition={{ duration: 1 }}
                  style={{ background: 'linear-gradient(90deg, #C5A065, #f0c85a)', height: '100%', borderRadius: 8 }} />
              </div>
              <p style={{ color: 'rgba(242,233,228,0.4)', fontSize: 12, marginTop: 4, textAlign: 'right' }}>
                {nextLevelData.xp - xp} XP to level {level + 1}
              </p>
            </div>
          </div>

          {/* Weekly Tip */}
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', marginBottom: 12 }}>Weekly Tip</h3>
            {weeklyTip ? (
              <p style={{ color: 'rgba(242,233,228,0.7)', fontSize: 13, lineHeight: 1.6 }}>{weeklyTip}</p>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => getWeeklyTip.mutate()}
                style={{ width: '100%', background: 'rgba(197,160,101,0.1)', border: '1px solid rgba(197,160,101,0.3)', borderRadius: 12, padding: 12, color: '#C5A065', cursor: 'pointer', fontSize: 13 }}>
                {getWeeklyTip.isPending ? '✨ Getting your tip...' : '✨ Get Weekly Tip'}
              </motion.button>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ ...cardStyle, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', fontSize: 20 }}>AI-Powered Insights</h3>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => refetch()}
              disabled={isFetching}
              style={{ background: 'linear-gradient(135deg, #C5A065, #a8845a)', color: '#0B0C10', border: 'none', borderRadius: 12, padding: '10px 20px', cursor: isFetching ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14, opacity: isFetching ? 0.7 : 1 }}>
              {isFetching ? '🔮 Generating...' : '🔮 Generate Insights'}
            </motion.button>
          </div>
          {insights.length === 0 ? (
            <p style={{ color: 'rgba(242,233,228,0.4)', textAlign: 'center', padding: 20, fontSize: 14 }}>
              Click "Generate Insights" to receive personalized financial guidance. 🌙
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {insights.map((insight) => {
                const style = insightTypeStyles[insight.type];
                return (
                  <motion.div key={insight.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{style.icon}</span>
                    <p style={{ color: '#F2E9E4', fontSize: 14, lineHeight: 1.6 }}>{insight.message}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badge collection */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#F2E9E4', fontSize: 20, marginBottom: 20 }}>Badge Collection</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 20 }}>
            {BADGE_DEFINITIONS.map((badge) => (
              <Badge key={badge.id} icon={badge.icon} name={badge.name} description={badge.description} locked={true} size="md" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
