import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { registerUser } from '@/store/slices/authSlice';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Xatolik', 'Barcha majburiy maydonlarni to‘ldiring.');
      return;
    }
    await dispatch(registerUser({ name, email, password, phone }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-oliveAccent"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-semibold text-oliveText mb-2">Yangi go‘zallik safarini boshlang</Text>
        <Text className="text-olivePrimary/70 mb-8">Ro‘yxatdan o‘tib, personal takliflar va chegirmalarni oling.</Text>

        <TextField label="Ism" placeholder="Dilnoza" value={name} onChangeText={setName} />
        <TextField
          label="Email"
          placeholder="hello@beauty.uz"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextField label="Telefon" placeholder="+998" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextField
          label="Parol"
          placeholder="******"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        <PrimaryButton
          label="Ro‘yxatdan o‘tish"
          className="mt-4"
          onPress={handleSubmit}
          loading={status === 'loading'}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-olivePrimary/70">Hisobingiz bormi?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-olivePrimary font-semibold ml-2">Kirish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
