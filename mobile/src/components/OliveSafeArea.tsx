import React from 'react';
import { SafeAreaView, ViewProps } from 'react-native';

interface OliveSafeAreaProps extends ViewProps {
  children: React.ReactNode;
}

export const OliveSafeArea: React.FC<OliveSafeAreaProps> = ({ children, style, ...rest }) => {
  return (
    <SafeAreaView className="flex-1 bg-oliveAccent" style={style} {...rest}>
      {children}
    </SafeAreaView>
  );
};
