import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onClear, ...rest }) => {
  const showClear = value && value.length > 0;
  return (
    <View className="flex-row items-center rounded-2xl bg-white px-4 py-3">
      <Icon name="search" size={20} color="#4C6A56" />
      <TextInput
        className="flex-1 ml-3 text-oliveText text-base"
        placeholderTextColor="#8FA497"
        value={value}
        {...rest}
      />
      {showClear ? (
        <Icon name="x" size={20} color="#4C6A56" onPress={onClear} />
      ) : null}
    </View>
  );
};
