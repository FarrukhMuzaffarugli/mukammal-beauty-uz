import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-xl font-semibold text-oliveText mb-2">{title}</Text>
      {description ? <Text className="text-center text-olivePrimary/70 mb-4">{description}</Text> : null}
      {action}
    </View>
  );
};
