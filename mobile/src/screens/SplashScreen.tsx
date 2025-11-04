import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { bootstrapAuth } from '@/store/slices/authSlice';

export const SplashScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <View className="flex-1 items-center justify-center bg-oliveAccent">
      <Text className="text-3xl font-semibold text-oliveText mb-4">Beauty.UZ</Text>
      <ActivityIndicator size="large" color="#4C6A56" />
      <Text className="text-olivePrimary/70 mt-4">{status === 'loading' ? 'Yuklanmoqda...' : ''}</Text>
    </View>
  );
};
