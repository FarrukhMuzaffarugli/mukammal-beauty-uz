import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import clsx from 'clsx';

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'solid' | 'outline';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  loading,
  variant = 'solid',
  className,
  disabled,
  ...rest
}) => {
  const baseStyles =
    variant === 'solid'
      ? 'bg-olivePrimary'
      : 'border border-olivePrimary bg-transparent';

  return (
    <TouchableOpacity
      className={clsx(
        'rounded-full py-3 px-5 flex-row items-center justify-center',
        baseStyles,
        disabled && 'opacity-60',
        className
      )}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? '#fff' : '#4C6A56'} />
      ) : (
        <Text
          className={clsx(
            'font-semibold text-base',
            variant === 'solid' ? 'text-white' : 'text-olivePrimary'
          )}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
