import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchCart,
  updateCartQuantity,
  removeCartItem,
  placeOrder,
  setCouponCode
} from '@/store/slices/cartSlice';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { QuantityStepper } from '@/components/QuantityStepper';
import { formatCurrency } from '@/utils/format';
import { resolveImageUrl } from '@/utils/media';
import { EmptyState } from '@/components/EmptyState';

export const CartScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, placingOrder, couponCode } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [couponInput, setCouponInput] = useState(couponCode ?? '');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const unitPrice = (item: typeof items[number]) =>
    item.product?.sale?.on ? item.product.sale.price : item.product?.price ?? item.price;

  const total = items.reduce((sum, item) => sum + item.qty * unitPrice(item), 0);

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Diqqat', 'Buyurtma berish uchun avval tizimga kiring');
      return;
    }
    const address = user.addresses.find((addr) => addr.is_default) ?? user.addresses[0];
    if (!address) {
      Alert.alert('Manzil kerak', 'Buyurtma berishdan oldin profil bo‘limida manzil qo‘shing.');
      return;
    }
    try {
      await dispatch(
        placeOrder({
          address,
          coupon_code: couponInput || undefined
        })
      ).unwrap();
      Alert.alert('Tabriklaymiz', 'Buyurtmangiz muvaffaqiyatli qabul qilindi!');
    } catch (error: any) {
      Alert.alert('Xatolik', error ?? 'Buyurtma berishda xatolik yuz berdi');
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Savatchangiz bo‘sh"
        description="Go‘zallik kolleksiyasini to‘ldirish uchun mahsulot qo‘shing"
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="px-6 pt-14">
        <Text className="text-3xl font-semibold text-oliveText">Savatcha</Text>
        <Text className="text-olivePrimary/70 mt-1">{items.length} ta mahsulot</Text>

        <View className="mt-6 space-y-4">
          {items.map((item) => (
            <View key={item.product_id} className="bg-white rounded-3xl p-4 flex-row">
              <Image
                source={{ uri: resolveImageUrl(item.product?.thumbnail ?? null) }}
                className="w-24 h-24 rounded-2xl"
                resizeMode="cover"
              />
              <View className="flex-1 ml-4 justify-between">
                <View>
                  <Text className="text-sm text-olivePrimary/70 uppercase">{item.product?.brand}</Text>
                  <Text className="text-lg font-semibold text-oliveText" numberOfLines={2}>
                    {item.product?.name ?? 'Mahsulot'}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <QuantityStepper
                    value={item.qty}
                    onIncrease={() => dispatch(updateCartQuantity({ productId: item.product_id, qty: item.qty + 1 }))}
                    onDecrease={() => dispatch(updateCartQuantity({ productId: item.product_id, qty: item.qty - 1 }))}
                  />
                  <View className="items-end">
                    <Text className="text-lg font-semibold text-olivePrimary">
                      {formatCurrency(item.qty * unitPrice(item))}
                    </Text>
                    <TouchableOpacity onPress={() => dispatch(removeCartItem(item.product_id))}>
                      <Text className="text-sm text-olivePrimary/60 mt-1">O‘chirish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-8">
          <TextField
            label="Promokod"
            placeholder="BEAUTY25"
            value={couponInput}
            onChangeText={setCouponInput}
            trailing={
              <TouchableOpacity
                onPress={() => dispatch(setCouponCode(couponInput))}
                className="bg-olivePrimary rounded-full px-3 py-1"
              >
                <Text className="text-white text-sm">Qo‘llash</Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View className="mt-4 bg-white rounded-3xl p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-olivePrimary/70">Jami</Text>
            <Text className="text-oliveText font-semibold">{formatCurrency(total)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-olivePrimary/70">Promokod</Text>
            <Text className="text-olivePrimary font-semibold">{couponInput || '—'}</Text>
          </View>
        </View>

        <PrimaryButton
          label="Buyurtma berish"
          className="mt-6"
          onPress={handleCheckout}
          loading={placingOrder}
        />
      </View>
    </ScrollView>
  );
};
