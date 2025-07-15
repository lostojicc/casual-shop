import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from './SideMenu';

const { width, height } = Dimensions.get('window');

export default function Header({ isScrolled = false, opacity = 1, style = {} }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

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
          {/* Hamburger Menu */}
          <TouchableOpacity className="p-2" onPress={toggleMenu}>
            <Ionicons name="menu" size={24} color="white" />
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