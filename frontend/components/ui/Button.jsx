import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  icon,
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2';
  
  const variantStyles = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-slate-700 hover:bg-slate-800 text-slate-300'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
