import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loadProductDetail, toggleWishlist } from '@/store/slices/catalogSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { formatCurrency } from '@/utils/format';
import { resolveImageUrl } from '@/utils/media';
import { SaleCountdown } from '@/components/SaleCountdown';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProductCard } from '@/components/ProductCard';
import { catalogApi } from '@/api/catalog';
import { Product } from '@/types';

type AppStackParamList = {
  ProductDetail: { productId: string };
};

type Props = NativeStackScreenProps<AppStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedProduct, wishlist } = useAppSelector((state) => state.catalog);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(loadProductDetail(productId));
    catalogApi
      .relatedProducts(productId)
      .then(setRelated)
      .catch(() => setRelated([]));
  }, [dispatch, productId]);

  if (!selectedProduct) {
    return (
      <View className="flex-1 items-center justify-center bg-oliveAccent">
        <Text className="text-olivePrimary/70">Mahsulot yuklanmoqda...</Text>
      </View>
    );
  }

  const salePrice = selectedProduct.sale?.on ? selectedProduct.sale.price : null;
  const wishlisted = wishlist.includes(selectedProduct.product_id);

  const handleAddToCart = () => {
    dispatch(addToCart(selectedProduct));
  };

  const heroImage = resolveImageUrl(selectedProduct.images[0] ?? selectedProduct.thumbnail);

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="px-6 pt-14">
        <View className="relative mb-6">
          {heroImage ? (
            <Image source={{ uri: heroImage }} className="w-full h-72 rounded-3xl" resizeMode="cover" />
          ) : (
            <View className="w-full h-72 rounded-3xl bg-olivePrimary/20 items-center justify-center">
              <Icon name="image" size={36} color="#4C6A56" />
              <Text className="text-olivePrimary/70 mt-2">Rasm mavjud emas</Text>
            </View>
          )}
          <TouchableOpacity
            className="absolute top-4 right-4 bg-white/90 p-3 rounded-full"
            onPress={() => dispatch(toggleWishlist(selectedProduct.product_id))}
          >
            <Icon name="heart" size={22} color={wishlisted ? '#C94B4B' : '#4C6A56'} />
          </TouchableOpacity>
        </View>

        <Text className="text-sm uppercase tracking-wide text-olivePrimary/70">{selectedProduct.brand}</Text>
        <Text className="text-3xl font-semibold text-oliveText mt-2">{selectedProduct.name}</Text>

        <View className="flex-row items-center mt-3">
          <Text className="text-3xl font-bold text-olivePrimary">{formatCurrency(salePrice ?? selectedProduct.price)}</Text>
          {salePrice ? (
            <Text className="text-base text-olivePrimary/60 line-through ml-3">
              {formatCurrency(selectedProduct.price)}
            </Text>
          ) : null}
        </View>

        {selectedProduct.sale?.on ? (
          <View className="mt-3">
            <SaleCountdown endsAt={selectedProduct.sale.ends_at ?? null} />
          </View>
        ) : null}

        <Text className="text-base leading-6 text-olivePrimary/85 mt-6">{selectedProduct.description}</Text>

        <View className="mt-8 gap-3">
          <View className="flex-row items-center">
            <Icon name="archive" size={18} color="#4C6A56" />
            <Text className="ml-2 text-oliveText">{selectedProduct.stock} dona mavjud</Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="tag" size={18} color="#4C6A56" />
            <Text className="ml-2 text-olivePrimary/80">SKU: {selectedProduct.sku}</Text>
          </View>
        </View>

        <PrimaryButton label="Savatchaga qo‘shish" className="mt-8" onPress={handleAddToCart} />

        {related.length > 0 ? (
          <View className="mt-10">
            <Text className="text-xl font-semibold text-oliveText mb-4">O‘xshash mahsulotlar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {related.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  wishlisted={wishlist.includes(product.product_id)}
                  onToggleWishlist={() => dispatch(toggleWishlist(product.product_id))}
                  onPress={() => navigation.push('ProductDetail', { productId: product.product_id })}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};
