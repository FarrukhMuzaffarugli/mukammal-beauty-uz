import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loadWishlist, toggleWishlist } from '@/store/slices/catalogSlice';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';

export const WishlistScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { wishlistProducts, wishlistStatus, wishlist } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  if (wishlistStatus === 'loading' && wishlistProducts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-oliveAccent">
        <Text className="text-olivePrimary/70">Yuklanmoqda...</Text>
      </View>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <EmptyState
        title="Sevimlilar bo‘sh"
        description="Mahsulotlarni qalbcha belgisini bosib saqlang"
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="px-6 pt-14">
        <Text className="text-3xl font-semibold text-oliveText">Sevimlilar</Text>
        <Text className="text-olivePrimary/70 mt-1">{wishlistProducts.length} ta tanlov</Text>

        <View className="flex-row flex-wrap justify-between mt-6">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              wishlisted={wishlist.includes(product.product_id)}
              onToggleWishlist={() => dispatch(toggleWishlist(product.product_id))}
              onPress={() => navigation.getParent()?.navigate('ProductDetail', { productId: product.product_id })}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
