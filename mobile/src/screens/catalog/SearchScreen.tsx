import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loadMoreProducts, loadProducts, toggleWishlist } from '@/store/slices/catalogSlice';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useDebounce } from '@/hooks/useDebounce';

import { TabParamList } from '@/navigation/MainTabs';

type Props = BottomTabScreenProps<TabParamList, 'Explore'>;

export const SearchScreen: React.FC<Props> = ({ route, navigation }) => {
  const initialQuery = route.params?.initialQuery ?? '';
  const initialSale = route.params?.saleOnly ?? false;
  const dispatch = useAppDispatch();
  const { products, meta, wishlist } = useAppSelector((state) => state.catalog);
  const [query, setQuery] = useState(initialQuery);
  const [saleOnly, setSaleOnly] = useState(initialSale);
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    dispatch(loadProducts({ search: debouncedQuery, sale: saleOnly, sort, page: 1 }));
  }, [debouncedQuery, saleOnly, sort, dispatch]);

  const handleLoadMore = () => {
    if (meta && meta.page < meta.totalPages) {
      dispatch(loadMoreProducts());
    }
  };

  const toggleSale = () => setSaleOnly((prev) => !prev);

  return (
    <View className="flex-1 bg-oliveAccent">
      <View className="px-6 pt-14 pb-4">
        <SearchBar
          placeholder="Qidirish..."
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
        />

        <View className="flex-row items-center justify-between mt-4">
          <TouchableOpacity
            onPress={toggleSale}
            className={`flex-row items-center px-4 py-2 rounded-full ${saleOnly ? 'bg-olivePrimary' : 'bg-white'}`}
          >
            <Icon name="zap" size={18} color={saleOnly ? '#fff' : '#4C6A56'} />
            <Text className={`ml-2 font-medium ${saleOnly ? 'text-white' : 'text-oliveText'}`}>Chegirmadagilar</Text>
          </TouchableOpacity>

          <View className="flex-row bg-white rounded-full px-2 py-1">
            {[
              { label: 'Yangi', value: 'newest' },
              { label: 'Narx ⬆', value: 'price_asc' },
              { label: 'Narx ⬇', value: 'price_desc' }
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSort(option.value as typeof sort)}
                className={`px-3 py-1 rounded-full ${sort === option.value ? 'bg-olivePrimary' : 'bg-transparent'}`}
              >
                <Text className={`text-sm ${sort === option.value ? 'text-white' : 'text-oliveText'}`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.product_id}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              wishlisted={wishlist.includes(item.product_id)}
              onToggleWishlist={() => dispatch(toggleWishlist(item.product_id))}
              onPress={() => navigation.getParent()?.navigate('ProductDetail', { productId: item.product_id })}
            />
          )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          meta && meta.page < meta.totalPages ? (
            <View className="mt-6">
              <PrimaryButton label="Yana ko‘rish" onPress={handleLoadMore} />
            </View>
          ) : null
        }
      />
    </View>
  );
};
