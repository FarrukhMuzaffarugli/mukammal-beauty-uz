import React from 'react';
import { TextInput, Text, TextInputProps, View } from 'react-native';
import clsx from 'clsx';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  trailing?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({ label, error, className, trailing, ...rest }) => {
  return (
    <View className={clsx('mb-4', className)}>
      {label ? <Text className="text-oliveText mb-2 font-medium">{label}</Text> : null}
      <View className={clsx('flex-row items-center rounded-2xl bg-white px-4 py-3', error && 'border border-red-400')}>
        <TextInput
          className="flex-1 text-oliveText text-base"
          placeholderTextColor="#8FA497"
          {...rest}
        />
        {trailing}
      </View>
      {error ? <Text className="text-sm text-red-500 mt-1">{error}</Text> : null}
    </View>
  );
};
