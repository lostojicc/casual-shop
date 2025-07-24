import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useCartStore } from '../../store/cartStore.js';

const Success = () => {
    const router = useRouter();
    const { clearCart } = useCartStore();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-11/12 max-w-md bg-white shadow-lg shadow-black items-center px-8 py-10">
        <Ionicons name="checkmark-circle" size={80} color="black" style={{ marginBottom: 24 }} />
        <Text className="text-black text-3xl font-bold mb-3 text-center tracking-tight">Purchase Successful</Text>
        <Text className="text-black text-base mb-1 text-center">Thank you for your order, we are processing it now.</Text>
        <Text className="text-black text-base mb-8 text-center">Check your email for order details and updates as well.</Text>
        <TouchableOpacity
          className="w-full py-3 bg-black items-center shadow-lg shadow-black rounded-none"
          onPress={() => router.replace('/')}>
          <Text className="text-white font-semibold text-base">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Success;