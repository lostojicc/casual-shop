import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import "../../assets/global.css";
import Header from '../../components/Header.jsx';
import HeroSection from '../../components/HeroSection';
import useFetch from "../../hooks/useFetch.js";
import CategoryCard from "../../components/CategoryCard";
import { getAllCategories } from "../../api/categories.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function HomePage() {
  const [scrollY] = useState(new Animated.Value(0));
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollViewRef = useRef(null);

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

  const signOut = async () => {
    await AsyncStorage.clear();
    console.log(await AsyncStorage.getItem("accessToken"));
  }

  const scrollToCategories = () => {
    scrollViewRef.current?.scrollTo({
      y: height,
      animated: true,
    });
  };

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch(() => getAllCategories());

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
        }}
      >
        <Header
          isScrolled={isScrolled}
          opacity={headerOpacity}
        />
      </Animated.View>

      {/* Transparent Header (when not scrolled) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <Header
          isScrolled={false}
          opacity={Animated.subtract(1, headerOpacity)}
        />
      </Animated.View>

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Hero Section with Background Image */}
        <HeroSection
          image={require('../../assets/images/hero.jpg')}
          title="Welcome to Casual Shop!"
          description={
            "Born from the terraces, built for the streets.\n" +
            "Our shop was founded on a deep-rooted love for football, fashion, and the culture that lives between the two.\n"
          }
          buttonText="Categories"
          onButtonPress={scrollToCategories}
          imageOpacity={imageOpacity}
          imageScale={imageScale}
          textOpacity={textOpacity}
          height={height}
        >
          {/* Read More button only for HomePage */}
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
        </HeroSection>

        {/* White Section */}
             
          {categoriesLoading ? (
              <ActivityIndicator />
          ) : categoriesError ? (
              <Text>Error: {categoriesError}</Text>
          ) : (
            <View className="bg-white">  
                  {categories?.map(cat => (
                    <CategoryCard
                      key={cat._id}
                      category={cat}/>
                  ))}
            </View>
          )}
      </ScrollView>
     </View>
  );
}
