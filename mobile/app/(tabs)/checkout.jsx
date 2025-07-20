import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import ShippingAddressForm from '../../components/ShippingAddressForm';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import api from '../../utils/api';

// Stripe publishable key - you'll need to replace this with your actual key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RmeHG971bRvkqf5ogoCrQ5BzNCZgpTFI08bGFB8XHMRY96r4WAnYxCPzll6MF64LkDQRc2VOxJku0bPD4DAH1AD00lBPH5yFM';

const CheckoutContent = () => {
  const { cart, subtotal, total } = useCartStore();
  const { token } = useAuthStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [step, setStep] = useState('address'); // 'address' or 'payment'
  const router = useRouter();

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setStep('payment');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    if (!shippingAddress) {
      Alert.alert('Error', 'Please provide shipping address');
      return;
    }

    setLoading(true);
    try {
      // Create payment intent
      const response = await api.post('/payment/create-payment-intent', {
        shippingAddress
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { clientSecret } = response.data;

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Casual Shop',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: shippingAddress.name,
        },
        appearance: {
          colors: {
            primary: '#000000',
            background: '#FFFFFF',
            componentBackground: '#FFFFFF',
            componentBorder: '#000000',
            componentDivider: '#000000',
            text: '#000000',
            textSecondary: '#666666',
            textPlaceholder: '#999999',
          },
          shapes: {
            borderRadius: 0, // No rounded corners
            shadow: {
              color: '#000000',
              opacity: 0.1,
              blur: 4,
              offset: {
                x: 0,
                y: 2,
              },
            },
          },
          primaryButton: {
            colors: {
              background: '#000000',
              text: '#FFFFFF',
            },
            shapes: {
              borderRadius: 0,
            },
          },
        },
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Error', presentError.message);
      } else {
        Alert.alert('Success', 'Payment completed successfully!');
        // Clear cart and redirect
        router.replace('/');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Something went wrong with the checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isScrolled={true} opacity={1} />
      
      <ScrollView className="mt-20 bg-white flex-1">
        <View className="px-5 pt-3 pb-3 shadow-lg shadow-black">
          <Text className="text-black text-2xl font-bold mb-1">Checkout</Text>
          <Text className="text-black text-base">
            {step === 'address' ? 'Step 1: Shipping Address' : 'Step 2: Payment'}
          </Text>
        </View>

        {step === 'address' ? (
          <ShippingAddressForm onAddressSubmit={handleAddressSubmit} />
        ) : (
          <>
            {/* Cart Items Summary */}
            <View className="px-5 py-4">
              <Text className="text-black text-lg font-semibold mb-3">Order Summary</Text>
              {cart.map((item) => (
                <View key={item._id} className="flex-row justify-between items-center py-2 border-b border-gray-200">
                  <View className="flex-1">
                    <Text className="text-black text-base font-medium">{item.name}</Text>
                    <Text className="text-gray-600 text-sm">Qty: {item.quantity}</Text>
                  </View>
                  <Text className="text-black text-base font-semibold">€{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Shipping Address Summary */}
            <View className="px-5 py-4 bg-gray-50">
              <Text className="text-black text-lg font-semibold mb-3">Shipping Address</Text>
              <Text className="text-black text-base">{shippingAddress.name}</Text>
              <Text className="text-black text-base">{shippingAddress.line1}</Text>
              {shippingAddress.line2 && <Text className="text-black text-base">{shippingAddress.line2}</Text>}
              <Text className="text-black text-base">{shippingAddress.city}, {shippingAddress.postalCode}</Text>
              <Text className="text-black text-base">{shippingAddress.country}</Text>
              <Text className="text-black text-base">{shippingAddress.phone}</Text>
            </View>

            {/* Totals */}
            <View className="px-5 py-4 bg-gray-50">
              <View className="flex-row justify-between mb-2">
                <Text className="text-black text-base">Subtotal</Text>
                <Text className="text-black text-base font-semibold">€{subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-black text-lg font-bold">Total</Text>
                <Text className="text-black text-lg font-bold">€{total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Payment Button */}
            <View className="px-5 py-6">
              <TouchableOpacity 
                onPress={handleCheckout}
                disabled={loading}
                className={`py-4 px-6 ${loading ? 'bg-gray-400' : 'bg-black'}`}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white text-base font-semibold ml-2">Processing...</Text>
                  </View>
                ) : (
                  <Text className="text-white text-base font-semibold text-center">
                    Pay €{total.toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default function Checkout() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <CheckoutContent />
    </StripeProvider>
  );
} 