import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Text, TextInput, View } from 'react-native';
import { fetchSearchProducts } from "../../api/products.js";
import Header from '../../components/Header';
import ProductCard from "../../components/ProductCard.jsx";
import useFetch from "../../hooks/useFetch.js";

const { width } = Dimensions.get('window');

const Search = () => {
    const [search, setSearch] = useState("");
    const { data: products, loading: productsLoading, error: productsError, refetch, reset } = useFetch(() => fetchSearchProducts(search), false);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (search.trim() === "") 
                refetch();
            else 
                refetch();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const renderProduct = ({ item }) => (
        <View style={{ width: (width - 48) / 2, marginBottom: 16 }}>
            <ProductCard product={item} />
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Header
                isScrolled={true}
                opacity={1}
            />

            {/* Search Section */}
            <View className="mt-20 bg-white shadow-lg shadow-black">
                <View className="px-4 py-6">
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search products..."
                        placeholderTextColor="#999999"
                        className={`rounded-none bg-white px-4 py-3 text-base text-gray-900 border border-gray-300 focus:border-black-600`}
                    />
                </View>
            </View>

            {/* Results Section */}
            <View className="flex-1 px-4">
                { productsLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                ) : productsError ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-red-500 text-center">Error: {productsError}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: 16 }}
                        style={{ flex: 1 }}
                        ListEmptyComponent={
                            !productsLoading && !productsError ? (
                                <View className="mt-10 px-5">
                                    <Text className="text-center text-base">
                                        { search.trim() ? "No products found" : "Search for a product"}
                                    </Text>
                                    
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>            
        </View>
    )
}

export default Search;