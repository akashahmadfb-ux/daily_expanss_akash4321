import React from 'react';

interface BadgeProps {
  icon: string;
  name: string;
  description?: string;
  locked?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  icon,
  name,
  description,
  locked = false,
  size = 'md',
}) => {
  const sizes = { sm: 48, md: 64, lg: 88 };
  const iconSizes = { sm: 24, md: 32, lg: 44 };
  const dim = sizes[size];
  const iconDim = iconSizes[size];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  };

  const circleStyle: React.CSSProperties = {
    width: dim,
    height: dim,
    borderRadius: '50%',
    background: locked
      ? 'rgba(11, 12, 16, 0.8)'
      : 'linear-gradient(135deg, rgba(197, 160, 101, 0.3), rgba(197, 160, 101, 0.1))',
    border: `2px solid ${locked ? 'rgba(197, 160, 101, 0.1)' : 'rgba(197, 160, 101, 0.5)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: iconDim,
    filter: locked ? 'grayscale(1) opacity(0.4)' : 'none',
    boxShadow: locked ? 'none' : '0 0 16px rgba(197, 160, 101, 0.2)',
  };

  const nameStyle: React.CSSProperties = {
    color: locked ? 'rgba(242, 233, 228, 0.4)' : '#F2E9E4',
    fontSize: size === 'sm' ? '11px' : '13px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={circleStyle}>
        {locked ? '🔒' : icon}
      </div>
      <span style={nameStyle}>{name}</span>
      {description && size === 'lg' && (
        <span
          style={{
            color: 'rgba(242, 233, 228, 0.6)',
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center',
            maxWidth: 100,
          }}
        >
          {description}
        </span>
      )}
    </div>
  );
};
