import { View, Text, Animated, StatusBar, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useCategory } from '../../hooks/useCategory';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';

const { width, height } = Dimensions.get('window');

const Category = () => {
    const { name } = useLocalSearchParams();
    const { category, loading, error } = useCategory(name);

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

    const scrollToProducts = () => {
        scrollViewRef.current?.scrollTo({
        y: height,
        animated: true,
        });
    };

    if (!category) return (<ActivityIndicator></ActivityIndicator>)

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
                insets={insets}
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
                insets={insets}
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
                    image={category.image}
                    title={category.name}
                    description={category.description}
                    buttonText="Products"
                    onButtonPress={scrollToProducts}
                    imageOpacity={imageOpacity}
                    imageScale={imageScale}
                    textOpacity={textOpacity}
                    height={height + insets.bottom}
                />

                {/* White Section */}
                <View className="bg-white">
                
                </View>
            </ScrollView>
        </View>
    )
}

export default Category