import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";
import { useCartStore } from "../store/cartStore.js";
import "../assets/global.css";

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
    <SafeAreaView className="flex-1 bg-black">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="(auth)"/>
      </Stack>
    </SafeAreaView>
    
  );
}
