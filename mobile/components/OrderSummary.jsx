import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const OrderSummary = ({ subtotal, total, onProceedToCheckout }) => {
  return (
    <View className="bg-white mx-auto my-4 w-11/12 shadow-lg shadow-black px-4 py-4">
      <Text className="text-black text-xl font-bold mb-4">Order Summary</Text>
      
      <View className="space-y-2 mb-4">
        <View className="flex-row justify-between">
          <Text className="text-black text-base">Subtotal</Text>
          <Text className="text-black text-base font-semibold">€{subtotal.toFixed(2)}</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-black text-base">Total</Text>
          <Text className="text-black text-lg font-bold">€{total.toFixed(2)}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={onProceedToCheckout}
        className="bg-black py-3 px-4"
      >
        <Text className="text-white text-base font-semibold text-center">
          Proceed to Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSummary; 