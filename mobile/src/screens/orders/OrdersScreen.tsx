import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchOrders } from '@/store/slices/orderSlice';
import { formatCurrency, formatDate } from '@/utils/format';
import { EmptyState } from '@/components/EmptyState';

export const OrdersScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { items, status } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === 'loading' && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-oliveAccent">
        <Text className="text-olivePrimary/70">Buyurtmalar yuklanmoqda...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Buyurtmalar hali yo‘q"
        description="Savatchadan buyurtma berib, go‘zallik yetkazib berishdan rohatlaning"
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="px-6 pt-14">
        <Text className="text-3xl font-semibold text-oliveText">Buyurtmalar</Text>
        <Text className="text-olivePrimary/70 mt-1">So‘nggi xaridlar</Text>

        <View className="mt-6 space-y-4">
          {items.map((order) => (
            <TouchableOpacity
              key={order.order_id}
              className="bg-white rounded-3xl p-4"
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.order_id })}
            >
              <View className="flex-row justify-between mb-2">
                <Text className="text-oliveText font-semibold">#{order.order_id}</Text>
                <Text className="text-olivePrimary/70">{formatDate(order.created_at)}</Text>
              </View>
              <Text className="text-olivePrimary/80 mb-1">{order.items.length} ta mahsulot</Text>
              <Text className="text-lg font-semibold text-olivePrimary">
                {formatCurrency(order.total_amount)}
              </Text>
              <View className="flex-row justify-between mt-3">
                <Text className="text-sm text-olivePrimary/70">To‘lov: {order.payment_status}</Text>
                <Text className="text-sm text-olivePrimary/70">Yetkazish: {order.delivery_status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
