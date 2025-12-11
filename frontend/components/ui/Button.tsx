import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
