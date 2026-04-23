import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerStyle?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  id,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(26, 26, 46, 0.8)',
    border: `1px solid ${error ? '#C9ADA7' : focused ? '#C5A065' : 'rgba(197, 160, 101, 0.2)'}`,
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#F2E9E4',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: focused ? '0 0 0 3px rgba(197, 160, 101, 0.1)' : 'none',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#C5A065',
    fontSize: '13px',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '6px',
    fontWeight: 500,
  };

  const errorStyle: React.CSSProperties = {
    color: '#C9ADA7',
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '4px',
  };

  return (
    <div style={{ marginBottom: '16px', ...containerStyle }}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};
