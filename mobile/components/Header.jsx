import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { useCartStore } from '../store/cartStore.js';
import SideMenu from './SideMenu';
import { useAuthStore } from '@/store/authStore.js';

const { width, height } = Dimensions.get('window');

export default function Header({ isScrolled = false, opacity = 1, style = {} }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const cart = useCartStore(state => state.cart);
  const { user } = useAuthStore();

  const toggleMenu = () => {
    if (isMenuVisible) {
      // Close menu
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsMenuVisible(false));
    } else {
      // Open menu
      setIsMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsMenuVisible(false));
  };

  const closeMenuInstantly = () => {
    setIsMenuVisible(false);
  }

  return (
    <>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingTop: 15,
            paddingHorizontal: 20,
            paddingBottom: 15,
            backgroundColor: isScrolled ? 'black' : 'transparent',
            opacity,
          },
          style,
        ]}
      >
        <View className="flex-row items-center justify-between">
          {/* Logo and Brand */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-white mr-3 items-center justify-center">
              <Text className="text-black font-bold text-sm">CS</Text>
            </View>
            <Text className="text-white font-bold text-lg">Casual Shop</Text>
          </View>
          {/* Hamburger Menu with Cart Badge */}
          <TouchableOpacity className="p-2 relative" onPress={toggleMenu}>
                          <Ionicons name="menu" size={24} color="white" />
              {(cart.length > 0 && user) && (
                <View className="absolute top-1.5 right-1.5 w-3 h-3 bg-white border border-black rounded-full items-center justify-center">
                </View>
              )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Side Menu */}
      {isMenuVisible && (
        <SideMenu
          isVisible={isMenuVisible}
          onClose={closeMenu}
          animatedValue={menuAnimation}
          onCloseInstantly={closeMenuInstantly}
        />
      )}
    </>
  );
} 