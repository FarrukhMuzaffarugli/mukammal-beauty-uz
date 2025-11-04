import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { resolveImageUrl } from '@/utils/media';
import { shadows } from '@/theme';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onToggleWishlist?: () => void;
  wishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onToggleWishlist, wishlisted }) => {
  const salePrice = product.sale?.on ? product.sale.price : null;
  const imageUrl = resolveImageUrl(product.thumbnail);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={shadows.card}
      className="bg-white rounded-3xl p-4 w-[170px] mr-4 mb-4"
    >
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-36 rounded-2xl"
          resizeMode="cover"
        />
        {product.sale?.on ? (
          <View className="absolute top-2 left-2 bg-olivePrimary/90 px-2 py-1 rounded-full">
            <Text className="text-xs text-white">Sale</Text>
          </View>
        ) : null}
        {onToggleWishlist ? (
          <TouchableOpacity
            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full"
            onPress={onToggleWishlist}
            activeOpacity={0.8}
          >
            <Icon name={wishlisted ? 'heart' : 'heart'} size={18} color={wishlisted ? '#C94B4B' : '#4C6A56'} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text className="text-xs text-olivePrimary/70 mt-3 uppercase tracking-wide">{product.brand}</Text>
      <Text className="text-base font-semibold text-oliveText mt-1" numberOfLines={2}>
        {product.name}
      </Text>
      <View className="flex-row items-center mt-2">
        <Text className="text-lg font-bold text-olivePrimary">{formatCurrency(salePrice ?? product.price)}</Text>
        {salePrice ? (
          <Text className="text-xs text-olivePrimary/50 line-through ml-2">
            {formatCurrency(product.price)}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
