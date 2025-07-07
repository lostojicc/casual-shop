import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import '../assets/global.css';

const { width, height } = Dimensions.get('window');

export default function HomePage() {
  const [scrollY] = useState(new Animated.Value(0));
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 1.25],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > 1);
      },
    }
  );

  const scrollToCategories = () => {
    scrollViewRef.current?.scrollTo({
      y: height,
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Header */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingTop: insets.top,
          paddingHorizontal: 20,
          paddingBottom: 15,
          backgroundColor: isScrolled ? 'black' : 'transparent',
          opacity: headerOpacity,
        }}
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

      {/* Transparent Header (when not scrolled) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          paddingTop: insets.top,
          paddingHorizontal: 20,
          paddingBottom: 15,
          opacity: Animated.subtract(1, headerOpacity),
        }}
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

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Hero Section with Background Image */}
        <View style={{ height: height + insets.bottom }}>
          {/* Background Image */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            }}
          >
            <Image
              source={require('../assets/images/hero.jpg')}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            <BlurView intensity={20} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            {/* Dark Overlay */}
            <View style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.6)' 
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
            <Text className="text-white text-4xl font-bold text-center mb-4">
              Welcome to Casual Shop!
            </Text>
            
            {/* Text with progressive fade effect */}
            <View style={{ 
              marginBottom: 20,
              maxHeight: 130,
              overflow: 'hidden',
            }}>
              <Text className="text-white text-lg text-center leading-6 opacity-70">
                Born from the terraces, built for the streets.
              </Text>
              <Text className="text-white text-lg text-center leading-6 opacity-50">
                Our shop was founded on a deep-rooted love for football, fashion, and the culture that lives between the two. 
              </Text>
              <Text className="text-white text-lg text-center leading-6 opacity-30">
                We're not just selling clothes — we're representing a legacy. The football casual movement has always been about more than 90 minutes on the pitch. 
              </Text> 
            </View>
            
            <TouchableOpacity 
              style={{
                borderWidth: 2,
                borderColor: 'white',
                paddingHorizontal: 32,
                paddingVertical: 16,
              }}
            >
              <Text className="text-white font-bold text-lg">Read More</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Categories Button */}
          <View className="absolute bottom-20 left-0 right-0 items-center">
            <TouchableOpacity onPress={scrollToCategories} className="items-center">
              <Text className="text-white text-lg font-medium mb-2">Categories</Text>
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* White Section */}
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
        <View className="bg-white px-6 py-12">
          <Text className="text-black text-3xl font-bold text-center mb-8">
            Welcome to Casual Shop
          </Text>
          <Text className="text-black text-lg text-center opacity-80">
            Your content goes here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
