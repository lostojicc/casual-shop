import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import CartItemCard from '../../components/CartItemCard';
import Header from "../../components/Header";
import { useAuthStore } from '../../store/authStore.js';
import useFetch from "../../hooks/useFetch.js";
import { getCartItems } from '../../api/cart.js';

export default function cart() {
    const { token, isCheckingAuth } = useAuthStore();
    const router = useRouter();
    
    useFocusEffect(useCallback(() => {
        if (!isCheckingAuth && !token)
            router.replace("/signin");

    }, [token, isCheckingAuth]));

    const { data: cartItems, loading: cartItemsLoading, error: cartItemsError } = useFetch(() => getCartItems(token));
    
    return (
        <>
            <Header
                isScrolled={true}
                opacity={1}
            />

            { cartItemsLoading ? (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    className="mt-20 self-center"
                />
            ) : cartItemsError ? (
                <Text className="mt-20">Error: {cartItemsError?.message }</Text>
            ) : (
                <>
                    <View className="mt-20 bg-white px-5 pt-3 pb-3 shadow-lg shadow-black">
                        <Text className="text-black text-2xl font-bold mb-1">Shopping Cart</Text>
                        <Text className="text-black text-base">You have {Array.isArray(cartItems) ? cartItems.length : 0} item{Array.isArray(cartItems) && cartItems.length == 1 ? "" : "s"} in your cart.</Text>
                    </View>

                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => <CartItemCard item={item} />}
                        className="bg-white"
                    />
                </>
            )}
        </>
    )
}