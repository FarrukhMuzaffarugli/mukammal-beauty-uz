import React from 'react';
import { View, Text } from 'react-native';
import { useCountdown } from '@/hooks/useCountdown';

interface SaleCountdownProps {
  endsAt: string | null;
}

export const SaleCountdown: React.FC<SaleCountdownProps> = ({ endsAt }) => {
  const { hours, minutes, seconds, isExpired } = useCountdown(endsAt);

  if (isExpired) {
    return <Text className="text-xs text-olivePrimary/70">Sotuv tugadi</Text>;
  }

  return (
    <View className="flex-row bg-olivePrimary/10 rounded-full px-3 py-1 items-center">
      <Text className="text-xs text-olivePrimary mr-2 uppercase tracking-wide">Chegirma</Text>
      <View className="flex-row items-center">
        <Text className="text-xs font-semibold text-olivePrimary">{hours}</Text>
        <Text className="text-xs text-olivePrimary mx-1">:</Text>
        <Text className="text-xs font-semibold text-olivePrimary">{minutes}</Text>
        <Text className="text-xs text-olivePrimary mx-1">:</Text>
        <Text className="text-xs font-semibold text-olivePrimary">{seconds}</Text>
      </View>
    </View>
  );
};
