import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchOrderDetail } from '@/store/slices/orderSlice';
import { formatCurrency, formatDate } from '@/utils/format';

type AppStackParamList = {
  OrderDetail: { orderId: string };
};

type Props = NativeStackScreenProps<AppStackParamList, 'OrderDetail'>;

export const OrderDetailScreen: React.FC<Props> = ({ route }) => {
  const dispatch = useAppDispatch();
  const { selectedOrder } = useAppSelector((state) => state.orders);
  const { orderId } = route.params;

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
  }, [dispatch, orderId]);

  if (!selectedOrder) {
    return (
      <View className="flex-1 items-center justify-center bg-oliveAccent">
        <Text className="text-olivePrimary/70">Buyurtma yuklanmoqda...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="px-6 pt-14">
        <Text className="text-3xl font-semibold text-oliveText">Buyurtma #{selectedOrder.order_id}</Text>
        <Text className="text-olivePrimary/70 mt-1">{formatDate(selectedOrder.created_at)}</Text>

        <View className="bg-white rounded-3xl p-4 mt-6">
          <Text className="text-lg font-semibold text-oliveText mb-3">Mahsulotlar</Text>
          {selectedOrder.items.map((item) => (
            <View key={item.product_id} className="flex-row justify-between mb-3">
              <View>
                <Text className="text-oliveText font-medium">{item.name}</Text>
                <Text className="text-olivePrimary/70">{item.qty} dona</Text>
              </View>
              <Text className="text-oliveText font-semibold">{formatCurrency(item.qty * item.price)}</Text>
            </View>
          ))}
          <View className="border-t border-oliveSecondary/30 pt-3 mt-3 flex-row justify-between">
            <Text className="text-olivePrimary/70">Jami</Text>
            <Text className="text-lg font-semibold text-olivePrimary">
              {formatCurrency(selectedOrder.total_amount)}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-3xl p-4 mt-6">
          <Text className="text-lg font-semibold text-oliveText mb-3">Manzil</Text>
          <Text className="text-oliveText font-medium">{selectedOrder.address.full_name}</Text>
          <Text className="text-olivePrimary/70 mt-1">{selectedOrder.address.phone}</Text>
          <Text className="text-olivePrimary/70 mt-1">
            {selectedOrder.address.city}, {selectedOrder.address.district}
          </Text>
          <Text className="text-olivePrimary/70 mt-1">{selectedOrder.address.street}</Text>
        </View>

        <View className="bg-white rounded-3xl p-4 mt-6">
          <Text className="text-lg font-semibold text-oliveText mb-3">Holat</Text>
          <Text className="text-olivePrimary/80">To‘lov: {selectedOrder.payment_status}</Text>
          <Text className="text-olivePrimary/80 mt-1">Yetkazish: {selectedOrder.delivery_status}</Text>
          {selectedOrder.coupon_code ? (
            <Text className="text-olivePrimary/80 mt-1">Promokod: {selectedOrder.coupon_code}</Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};
