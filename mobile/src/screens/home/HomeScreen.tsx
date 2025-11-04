import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loadCategories, loadProducts, toggleWishlist } from '@/store/slices/catalogSlice';
import { SearchBar } from '@/components/SearchBar';
import { PromoBanner } from '@/components/PromoBanner';
import { CategoryPill } from '@/components/CategoryPill';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeader } from '@/components/SectionHeader';
import { SaleCountdown } from '@/components/SaleCountdown';
import { PrimaryButton } from '@/components/PrimaryButton';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { products, categories, status, wishlist } = useAppSelector((state) => state.catalog);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadCategories());
    dispatch(loadProducts(undefined));
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((product) => product.category_id.includes(selectedCategory));
  }, [products, selectedCategory]);

  const saleProducts = useMemo(() => filteredProducts.filter((product) => product.sale?.on), [filteredProducts]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleSearchSubmit = () => {
    navigation.navigate('Explore', { initialQuery: search });
  };

  return (
    <ScrollView className="flex-1 bg-oliveAccent" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-6 pt-14 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-sm text-olivePrimary/70">Olive Young ilhomida</Text>
            <Text className="text-3xl font-semibold text-oliveText">Beauty.UZ</Text>
          </View>
          <TouchableOpacity
            className="bg-white rounded-full p-3"
            onPress={() => navigation.getParent()?.navigate('Orders')}
          >
            <Icon name="shopping-bag" size={20} color="#4C6A56" />
          </TouchableOpacity>
        </View>

        <SearchBar
          placeholder="Mahsulot qidirish"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          onClear={() => setSearch('')}
        />

        <PromoBanner
          title="Fresh Glow Week"
          description="Tabiiy ingredientli bestseller mahsulotlarga 25% gacha chegirma"
        />

        <SectionHeader title="Kategoriya" subtitle="Kayfiyatga mos kosmetika" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-ml-2 mb-6">
          {categories.map((category) => (
            <CategoryPill
              key={category.category_id}
              label={category.name}
              selected={selectedCategory === category.category_id}
              onPress={() => handleCategorySelect(category.category_id)}
            />
          ))}
        </ScrollView>

        {saleProducts.length > 0 ? (
          <View className="mb-8">
            <SectionHeader
              title="Chegirmadagi kolleksiya"
              subtitle="Limitlangan vaqt"
              actionLabel="Barchasi"
              onActionPress={() => navigation.navigate('Explore', { saleOnly: true })}
            />
            <SaleCountdown endsAt={saleProducts[0].sale?.ends_at ?? null} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {saleProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  wishlisted={wishlist.includes(product.product_id)}
                  onToggleWishlist={() => dispatch(toggleWishlist(product.product_id))}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.product_id })}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <SectionHeader title="Yangi kelganlar" subtitle="Haftaning trend brendlari" />
        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              wishlisted={wishlist.includes(product.product_id)}
              onToggleWishlist={() => dispatch(toggleWishlist(product.product_id))}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.product_id })}
            />
          ))}
        </View>

        {status === 'loading' && products.length === 0 ? (
          <Text className="text-center text-olivePrimary/70 mt-8">Mahsulotlar yuklanmoqda...</Text>
        ) : null}

        <PrimaryButton
          label="Hammasini ko‘rish"
          className="mt-6"
          onPress={() => navigation.navigate('Explore')}
        />
      </View>
    </ScrollView>
  );
};
