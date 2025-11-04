import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { SearchScreen } from '@/screens/catalog/SearchScreen';
import { CartScreen } from '@/screens/cart/CartScreen';
import { WishlistScreen } from '@/screens/wishlist/WishlistScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

export type TabParamList = {
  Home: undefined;
  Explore: { initialQuery?: string; saleOnly?: boolean } | undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabIcon = (name: string) => ({ color, size }: { color: string; size: number }) => (
  <Icon name={name} color={color} size={size} />
);

export const MainTabsNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#4C6A56',
      tabBarInactiveTintColor: '#9DBBAE',
      tabBarStyle: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: 70,
        paddingBottom: 12,
        paddingTop: 8,
        backgroundColor: '#FFFFFF'
      }
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: tabIcon('home'), tabBarLabel: 'Bosh' }} />
    <Tab.Screen
      name="Explore"
      component={SearchScreen}
      options={{ tabBarIcon: tabIcon('search'), tabBarLabel: 'Izlash' }}
    />
    <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: tabIcon('shopping-cart'), tabBarLabel: 'Savatcha' }} />
    <Tab.Screen
      name="Wishlist"
      component={WishlistScreen}
      options={{ tabBarIcon: tabIcon('heart'), tabBarLabel: 'Sevimli' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: tabIcon('user'), tabBarLabel: 'Profil' }} />
  </Tab.Navigator>
);
