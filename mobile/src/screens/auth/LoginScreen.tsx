import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loginUser } from '@/store/slices/authSlice';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Xatolik', 'Email va parolni kiriting.');
      return;
    }
    await dispatch(loginUser({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-oliveAccent"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-semibold text-oliveText mb-2">Qaytganingizdan xursandmiz</Text>
        <Text className="text-olivePrimary/70 mb-8">Hisobingizga kirib, sevimli kosmetikangizni xarid qiling.</Text>

        <TextField
          label="Email"
          placeholder="hello@beauty.uz"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Parol"
          placeholder="******"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        <PrimaryButton
          label="Kirish"
          className="mt-4"
          onPress={handleSubmit}
          loading={status === 'loading'}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-olivePrimary/70">Hisobingiz yo‘qmi?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-olivePrimary font-semibold ml-2">Ro‘yxatdan o‘tish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
