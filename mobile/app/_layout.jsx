import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";
import { useCartStore } from "../store/cartStore.js";
import "../assets/global.css";
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  const { checkAuth, user, token } = useAuthStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user || !token) return;

    getCartItems(token);
  }, [getCartItems, user, token]);

  return (
    <StripeProvider publishableKey="pk_test_51RmeHG971bRvkqf5ogoCrQ5BzNCZgpTFI08bGFB8XHMRY96r4WAnYxCPzll6MF64LkDQRc2VOxJku0bPD4DAH1AD00lBPH5yFM"
                    merchantIdentifier="merchant.casual-shop.com"
                    urlScheme="mobile">
      <SafeAreaView className="flex-1 bg-black">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="(auth)"/>
        </Stack>
      </SafeAreaView>
    </StripeProvider>
  );
}
