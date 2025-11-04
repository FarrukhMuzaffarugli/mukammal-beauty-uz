import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionLabel, onActionPress }) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View>
        <Text className="text-xl font-semibold text-oliveText">{title}</Text>
        {subtitle ? <Text className="text-sm text-olivePrimary/70 mt-1">{subtitle}</Text> : null}
      </View>
      {actionLabel ? (
        <TouchableOpacity onPress={onActionPress}>
          <Text className="text-sm font-semibold text-olivePrimary">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
