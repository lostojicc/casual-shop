import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Ionicons } from '@expo/vector-icons';
// import { useRoute } from '@react-navigation/native';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SideMenu({ isVisible, onClose, animatedValue, onCloseInstantly }) {
  // const currentRoute = useRoute();
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const cart = useCartStore(state => state.cart);
  
  const menuTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  const overlayOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const menuItems = [
    { icon: 'home', label: 'Home', route: '' },
    { icon: 'cart', label: 'Cart', route: 'cart' },
    { icon: 'receipt', label: 'Orders', route: 'profile' },
    { icon: 'search', label: 'Search', route: 'search' },
    { icon: 'grid', label: 'Dashboard', route: 'admin' }
  ];

  const isActiveRoute = (route) => {
    // return route === currentRoute.name;
    // For expo-router, check if pathname ends with the route (for tabs)
    if (route === '') return pathname === '/' || pathname === '/(tabs)';
    return pathname.endsWith(`/${route}`);
  };

  const navigate = (route) => {
    onCloseInstantly();
    router.push(`/${route}`);
  }

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          opacity: overlayOpacity,
          zIndex: 999,
        }}
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Menu */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: width * 0.8,
          height: height,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          transform: [{ translateX: menuTranslateX }],
          zIndex: 1000,
        }}
      >
        {/* Header */}
        <View 
          style={{
            paddingTop: 15,
            paddingHorizontal: 20,
            paddingBottom: 15
          }}
        >
          <View className="flex-row items-center justify-end">
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1 border-t border-white">
          {menuItems.map((item, index) => {
            const isActive = isActiveRoute(item.route);
            if (item.route === 'admin' && user?.role !== 'admin')
              return;
            return (
              <TouchableOpacity 
                key={index}
                className={`flex-row items-center py-4 px-6 w-full ${
                  isActive ? 'bg-white' : ''
                }`}
                onPress={() => {
                  navigate(item.route);
                }}
              >
                <View className="relative">
                  <Ionicons 
                    name={item.icon} 
                    size={20} 
                    color={isActive ? 'black' : 'white'} 
                  />
                  {(item.icon === 'cart' && cart.length > 0 && user) && (
                    <View className={`absolute -top-1 -right-1 w-4 h-4 border ${isActive ? "bg-black border-white" : "bg-white border-black"} rounded-full items-center justify-center`}>
                      <Text className={`text-xs ${isActive ? "text-white" : "text-black"}`}>
                        {cart.length > 99 ? '99+' : cart.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className={`text-lg ml-4 ${
                  isActive ? 'text-black' : 'text-white'
                }`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

        </View>
        <View className="px-0 mb-5">
          {user ? (
            <TouchableOpacity
              className="flex-row items-center py-4 px-6 w-full border-t border-white"
              onPress={async () => {
                onCloseInstantly();
                await signOut();
              }}
            >
              <Ionicons name="log-out" size={20} color="white" />
              <Text className="text-white text-lg ml-4">Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="flex-row items-center py-4 px-6 w-full border-t border-white"
              onPress={() => {
                onCloseInstantly();
                router.push("/signin");
              }}
            >
              <Ionicons name="log-in" size={20} color="white" />
              <Text className="text-white text-lg ml-4">Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </>
  );
} 