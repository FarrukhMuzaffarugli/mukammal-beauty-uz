import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface CategoryPillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      className={clsx(
        'px-4 py-2 rounded-full mr-3 mb-2 border',
        selected ? 'bg-olivePrimary border-olivePrimary' : 'bg-white border-oliveSecondary/40'
      )}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text className={clsx('text-sm font-medium', selected ? 'text-white' : 'text-oliveText')}>{label}</Text>
    </TouchableOpacity>
  );
};
