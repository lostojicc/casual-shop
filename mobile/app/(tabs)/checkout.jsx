import { Ionicons } from '@expo/vector-icons';
import { useStripe, AppearanceParams } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ShippingAddressForm from '../../components/ShippingAddressForm';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import api from '../../utils/api.js';

export default function Checkout() {
  const { cart, subtotal, total } = useCartStore();
  const { token } = useAuthStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isInitializing, setIsInitializing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);

  const fetchPaymentIntent = async () => {
    const { data } = await api.post(
      '/payment/create-intent',
      { shippingAddress }, // body if needed
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!data?.client_secret) {
      throw new Error('Server did not return client_secret');
    }
    return data.client_secret;
  };

  const stripeAppearance = {
    colors: {
      primary: '#000000',
      background: "#ffffff",
      icon: "#000000",
      componentBorder: '#808080',
      componentDivider: '#808080',
      componentBackground: "#ffffff",
      text: "#000000",
      primaryText: '#000000',
      secondaryText: '#000000',
      componentText: '#000000',
      placeholderText: '#808080',
      componentPlaceholderText: '#808080'
    },
    shapes: {
      borderRadius: 0
    }
  }

  const initializePaymentSheet = async () => {
    try {
        setIsInitializing(true);

        // 1. Get / create PaymentIntent on server
        const cs = await fetchPaymentIntent();
        setClientSecret(cs);

        // 2. Initialize PaymentSheet
        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: cs,
            merchantDisplayName: 'Casual Shop',
            appearance: stripeAppearance
            // (optional) defaultBillingDetails: { name: 'Jane Doe' },
            // (optional) allowsDelayedPaymentMethods: true,
        });

        if (error) {
            Alert.alert('Init failed', error.message);
            return;
        }

        // 3. Present sheet
        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
            Alert.alert('Payment failed', presentError.message);
        } else {
            Alert.alert('Success', 'Your payment is confirmed!');
            
            setClientSecret(null); // clear so a new intent is made next time
        }
    } catch (e) {
        Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
        setIsInitializing(false);
    }
  };

  // Step 1: handle shipping form submit
  const handleShippingSubmit = (address) => {
    setShippingAddress(address);
    setStep(2);
  };

  return (

    <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-row items-center justify-center h-16 shadow-lg shadow-black bg-white w-full">
      <TouchableOpacity
        className="absolute left-0 pl-4 h-full justify-center"
        onPress={() => router.replace('/cart')}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      <Text className="text-black text-2xl font-bold text-center">Checkout</Text>
    </View>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="bg-white w-11/12 mx-auto mt-8 mb-6 shadow-lg shadow-black px-0 py-0 rounded-none">
            <Text className="text-black text-2xl font-bold px-6 pt-6 pb-2 tracking-tight">Your Order</Text>
            <View className="divide-y divide-black">
            {cart.length === 0 ? (
                <Text className="text-black text-base px-6 py-6">Your cart is empty.</Text>
            ) : (
                cart.map((item) => (
                <View key={item._id} className="flex-row items-center px-6 py-4 bg-white">
                    <Image source={{ uri: item.image }} className="w-16 h-16 mr-4" style={{ resizeMode: 'cover' }} />
                    <View className="flex-1 min-w-[80px]">
                    <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>{item.brand}</Text>
                    <Text className="text-base text-black font-semibold mb-1" numberOfLines={2}>{item.name}</Text>
                    <Text className="text-xs text-gray-500">{item.quantity} × <Text className="text-black font-bold">€{item.price.toFixed(2)}</Text> each</Text>
                    </View>
                    <View className="items-end min-w-[80px]">
                    <Text className="text-black text-lg font-bold">€{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                </View>
                ))
            )}
            </View>
            {/* Subtotal and total */}
            <View className="px-6 pt-4 pb-6 bg-white">
            <View className="flex-row justify-between mb-1">
                <Text className="text-black text-base">Subtotal</Text>
                <Text className="text-black text-base font-semibold">€{subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between border-t border-black pt-3 mt-2">
                <Text className="text-black text-xl font-bold">Total</Text>
                <Text className="text-black text-xl font-bold">€{total.toFixed(2)}</Text>
            </View>
            </View>
        </View>
        <View className="flex-row w-11/12 mx-auto space-x-2">
            <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-none shadow-lg ${step === 1 ? 'bg-black' : 'bg-white shadow-black'}`}
                onPress={() => setStep(1)}
            >
                <Text className={`font-bold text-base ${step === 1 ? 'text-white' : 'text-black'}`}>Step 1: Shipping</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-none shadow-lg ${step === 2 ? 'bg-black' : 'bg-white shadow-black'}`}
                onPress={() => setStep(2)}
                disabled={!shippingAddress}
                activeOpacity={!shippingAddress ? 0.7 : 1}
            >
                <Text className={`font-bold text-base ${step === 2 ? 'text-white' : 'text-black'}`}>Step 2: Payment</Text>
            </TouchableOpacity>
        </View>
        { step === 1 ? (
            <View className="w-11/12 mx-auto mb-8 bg-white shadow-lg shadow-black px-6 py-6">
                <View className="">
                    <Text className="text-black text-xl font-bold mb-4">Shipping Address</Text>
                    <ShippingAddressForm onAddressSubmit={handleShippingSubmit} initialAddress={shippingAddress} />
                </View>
            </View>
        ) : (
            <View className="w-11/12 mx-auto mb-8 bg-white shadow-lg shadow-black px-6 py-6">
                <Text className="text-black text-xl font-bold mb-4">Payment</Text>
                {/* Shipping Address Summary */}
                {shippingAddress && (
                  <View className="mb-6 bg-white shadow-lg shadow-black px-4 py-4">
                    <Text className="text-black text-base font-semibold mb-2">Shipping to:</Text>
                    <Text className="text-black text-base">{shippingAddress.name}</Text>
                    <Text className="text-black text-base">{shippingAddress.line1}</Text>
                    {shippingAddress.line2 ? (
                      <Text className="text-black text-base">{shippingAddress.line2}</Text>
                    ) : null}
                    <Text className="text-black text-base">{shippingAddress.city}, {shippingAddress.postalCode}</Text>
                    <Text className="text-black text-base">{shippingAddress.country}</Text>
                  </View>
                )}
                <TouchableOpacity
                className="w-full py-3 bg-black items-center shadow-lg shadow-black rounded-none"
                onPress={initializePaymentSheet}
                >
                    <Text className="text-white font-semibold text-base">Pay €{total.toFixed(2)}</Text>
                </TouchableOpacity>
            </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
