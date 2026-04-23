import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  style,
  glow = false,
  onClick,
}) => {
  const baseStyle: React.CSSProperties = {
    background: 'rgba(11, 12, 16, 0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(197, 160, 101, 0.2)',
    borderRadius: '20px',
    boxShadow: glow
      ? '0 8px 32px rgba(11, 12, 16, 0.5), 0 0 20px rgba(197, 160, 101, 0.3)'
      : '0 8px 32px rgba(11, 12, 16, 0.5)',
    padding: '24px',
    ...style,
  };

  return (
    <div className={className} style={baseStyle} onClick={onClick}>
      {children}
    </div>
  );
};
