import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabsNavigator } from './MainTabs';
import { ProductDetailScreen } from '@/screens/catalog/ProductDetailScreen';
import { OrdersScreen } from '@/screens/orders/OrdersScreen';
import { OrderDetailScreen } from '@/screens/orders/OrderDetailScreen';

export type AppStackParamList = {
  Tabs: undefined;
  ProductDetail: { productId: string };
  Orders: undefined;
  OrderDetail: { orderId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStackNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={MainTabsNavigator} options={{ headerShown: false }} />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Mahsulot ma’lumotlari', headerBackTitle: 'Orqaga' }}
    />
    <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Buyurtmalar' }} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Buyurtma' }} />
  </Stack.Navigator>
);
