import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { userApi } from '@/api/users';
import { refreshProfile, logoutUser } from '@/store/slices/authSlice';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';

export const ProfileScreen: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressName, setAddressName] = useState(user?.name ?? '');
  const [addressPhone, setAddressPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');

  const handleSaveProfile = async () => {
    try {
      await userApi.updateProfile({ name, phone });
      await dispatch(refreshProfile());
      setEditing(false);
      Alert.alert('Saqlangan', 'Profil ma’lumotlari yangilandi');
    } catch (error) {
      Alert.alert('Xatolik', 'Profilni yangilashda muammo yuz berdi');
    }
  };

  const handleAddAddress = async () => {
    if (!addressName || !city || !district || !street) {
      Alert.alert('Eslatma', 'Manzil ma’lumotlari to‘liq bo‘lishi kerak');
      return;
    }
    try {
      await userApi.addAddress({
        label: addressLabel,
        full_name: addressName,
        phone: addressPhone,
        city,
        district,
        street,
        is_default: user?.addresses.length === 0
      });
      await dispatch(refreshProfile());
      setAddressFormOpen(false);
      setCity('');
      setDistrict('');
      setStreet('');
      Alert.alert('Saqlangan', 'Manzil qo‘shildi');
    } catch (error) {
      Alert.alert('Xatolik', 'Manzilni saqlashda xatolik yuz berdi');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert('Tasdiqlang', 'Manzilni o‘chirmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      {
        text: 'Ha',
        style: 'destructive',
        onPress: async () => {
          await userApi.deleteAddress(addressId);
          await dispatch(refreshProfile());
        }
      }
    ]);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-oliveAccent">
        <Text className="text-olivePrimary/70">Tizimga kiring</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="px-6 pt-14">
        <Text className="text-3xl font-semibold text-oliveText">Profil</Text>
        <Text className="text-olivePrimary/70 mt-1">Shaxsiy ma’lumotlar va manzillar</Text>

        <View className="bg-white rounded-3xl p-4 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-oliveText">Shaxsiy ma’lumotlar</Text>
            <TouchableOpacity onPress={() => setEditing((prev) => !prev)}>
              <Text className="text-olivePrimary font-semibold">{editing ? 'Bekor qilish' : 'Tahrirlash'}</Text>
            </TouchableOpacity>
          </View>
          {editing ? (
            <View>
              <TextField label="Ism" value={name} onChangeText={setName} />
              <TextField label="Telefon" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <PrimaryButton label="Saqlash" onPress={handleSaveProfile} />
            </View>
          ) : (
            <View>
              <Text className="text-oliveText font-medium">{user.name}</Text>
              <Text className="text-olivePrimary/70 mt-1">{user.email}</Text>
              <Text className="text-olivePrimary/70 mt-1">{user.phone}</Text>
            </View>
          )}
        </View>

        <View className="bg-white rounded-3xl p-4 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-oliveText">Manzillar</Text>
            <TouchableOpacity onPress={() => setAddressFormOpen((prev) => !prev)}>
              <Text className="text-olivePrimary font-semibold">{addressFormOpen ? 'Bekor qilish' : 'Manzil qo‘shish'}</Text>
            </TouchableOpacity>
          </View>

          {user.addresses.map((address) => (
            <View key={address.address_id} className="border border-oliveSecondary/30 rounded-2xl p-3 mb-3">
              <View className="flex-row justify-between">
                <Text className="text-oliveText font-semibold">{address.label}</Text>
                {address.is_default ? (
                  <Text className="text-xs text-olivePrimary">Asosiy</Text>
                ) : null}
              </View>
              <Text className="text-olivePrimary/80 mt-1">{address.full_name}</Text>
              <Text className="text-olivePrimary/80">{address.phone}</Text>
              <Text className="text-olivePrimary/70 mt-1">
                {address.city}, {address.district}
              </Text>
              <Text className="text-olivePrimary/70">{address.street}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteAddress(address.address_id)}
                className="flex-row items-center mt-2"
              >
                <Icon name="trash" size={16} color="#C94B4B" />
                <Text className="text-xs text-red-500 ml-1">O‘chirish</Text>
              </TouchableOpacity>
            </View>
          ))}

          {addressFormOpen ? (
            <View className="mt-2">
              <TextField label="Turi" value={addressLabel} onChangeText={setAddressLabel} />
              <TextField label="To‘liq ism" value={addressName} onChangeText={setAddressName} />
              <TextField label="Telefon" value={addressPhone} onChangeText={setAddressPhone} keyboardType="phone-pad" />
              <TextField label="Shahar" value={city} onChangeText={setCity} />
              <TextField label="Tuman" value={district} onChangeText={setDistrict} />
              <TextField label="Ko‘cha" value={street} onChangeText={setStreet} />
              <PrimaryButton label="Manzilni saqlash" onPress={handleAddAddress} />
            </View>
          ) : null}
        </View>

        <PrimaryButton label="Chiqish" variant="outline" className="mt-8" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};
