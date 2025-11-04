import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface QuantityStepperProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({ value, onIncrease, onDecrease, min = 1 }) => {
  return (
    <View className="flex-row items-center bg-white rounded-full px-3 py-1">
      <TouchableOpacity onPress={onDecrease} disabled={value <= min} activeOpacity={0.7}>
        <Icon name="minus" size={18} color={value <= min ? '#D1D8D5' : '#4C6A56'} />
      </TouchableOpacity>
      <Text className="mx-3 text-base font-semibold text-oliveText">{value}</Text>
      <TouchableOpacity onPress={onIncrease} activeOpacity={0.7}>
        <Icon name="plus" size={18} color="#4C6A56" />
      </TouchableOpacity>
    </View>
  );
};
