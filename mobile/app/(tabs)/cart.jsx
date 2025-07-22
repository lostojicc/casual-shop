import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import CartItemCard from '../../components/CartItemCard';
import Header from "../../components/Header";
import OrderSummary from '../../components/OrderSummary';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';

export default function cart() {
    const { cart, subtotal, total, calculateTotals } = useCartStore();
    const { token, isCheckingAuth } = useAuthStore();
    const router = useRouter();
    
    useFocusEffect(useCallback(() => {
        if (!isCheckingAuth && !token)
            router.replace("/signin");

    }, [token, isCheckingAuth]));

    useEffect(() => {
        calculateTotals();
    }, [cart, calculateTotals]);

    const handleProceedToCheckout = () => {
        router.push("/checkout");
    };

    return (
        <>
            <Header
                isScrolled={true}
                opacity={1}
            />

            <View className="mt-20 bg-white px-5 pt-3 pb-3 shadow-lg shadow-black">
                <Text className="text-black text-2xl font-bold mb-1">Shopping Cart</Text>
            { cart.length === 0 ? (
                <Text className="text-black text-base">Your cart is currently empty.</Text>
            ) : (
                <Text className="text-black text-base">You have {cart.length} item{cart.length == 1 ? "" : "s"} in your cart.</Text>
            )}
            </View>

            { cart.length !== 0 && (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => <CartItemCard item={item} />}
                        ListFooterComponent={
                            <OrderSummary 
                                subtotal={subtotal}
                                total={total}
                                onProceedToCheckout={handleProceedToCheckout}
                            />
                        }
                    />
                </>
            )}
        </>
    )
}