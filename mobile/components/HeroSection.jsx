import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height: windowHeight } = Dimensions.get('window');

export default function HeroSection({
  image,
  title,
  description,
  buttonText,
  onButtonPress,
  children,
  imageOpacity = 1,
  imageScale = 1,
  textOpacity = 1,
  height,
}) {
  return (
    <View style={{ height: height || windowHeight, backgroundColor: 'black' }}>
      {/* Background Image with overlays */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: imageOpacity,
          transform: [{ scale: imageScale }],
        }}
      >
        <Image
          source={image}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <BlurView intensity={20} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)'
        }} />
      </Animated.View>

      {/* Content Overlay */}
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
          opacity: textOpacity,
        }}
      >
        <Text className="text-white text-4xl font-bold text-center mb-4">{title}</Text>
        <Text className="text-white text-lg text-center leading-6 opacity-70 mb-4">{description}</Text>
        {children}
      </Animated.View>

      {/* Scroll Button */}
      <View className="absolute bottom-20 left-0 right-0 items-center">
        <TouchableOpacity onPress={onButtonPress} className="items-center">
          <Text className="text-white text-lg font-medium mb-2">{buttonText}</Text>
          <Ionicons name="chevron-down" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
} 