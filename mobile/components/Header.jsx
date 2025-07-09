import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ isScrolled = false, opacity = 1, style = {} }) {
  return (
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
        <TouchableOpacity className="p-2">
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
} 