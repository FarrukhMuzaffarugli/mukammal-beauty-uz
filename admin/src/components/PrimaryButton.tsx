import React from 'react';
import clsx from 'clsx';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'solid' | 'outline';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, variant = 'solid', className, ...rest }) => {
  return (
    <button
      className={clsx(
        'rounded-full px-5 py-2 text-sm font-semibold transition',
        variant === 'solid'
          ? 'bg-olivePrimary text-white hover:bg-olivePrimary/90'
          : 'border border-olivePrimary text-olivePrimary hover:bg-olivePrimary hover:text-white',
        'disabled:opacity-60',
        className
      )}
      {...rest}
    >
      {label}
    </button>
  );
};
