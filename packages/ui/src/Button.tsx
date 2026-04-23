import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #C5A065, #a8845a)',
    color: '#0B0C10',
    border: 'none',
    fontWeight: 600,
  },
  secondary: {
    background: 'rgba(11, 12, 16, 0.6)',
    backdropFilter: 'blur(16px)',
    color: '#F2E9E4',
    border: '1px solid rgba(197, 160, 101, 0.3)',
  },
  danger: {
    background: 'rgba(201, 173, 167, 0.2)',
    color: '#C9ADA7',
    border: '1px solid rgba(201, 173, 167, 0.4)',
  },
  ghost: {
    background: 'transparent',
    color: '#C5A065',
    border: '1px solid transparent',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  isLoading,
  style,
  disabled,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...variantStyles[variant],
    ...style,
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      style={baseStyle}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading ? '...' : children}
    </motion.button>
  );
};
