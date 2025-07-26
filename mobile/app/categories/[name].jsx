import { View, Text, Animated, StatusBar, ScrollView, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import useFetch from '../../hooks/useFetch';
import { fetchProductsByCategory } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import { useEffect } from 'react';
import { getCategoryByName } from '../../api/categories';

const { width, height } = Dimensions.get('window');

const Category = () => {
    const { name } = useLocalSearchParams();
    const { data: category, loading: categoryLoading, error: categoryError } = useFetch(() => getCategoryByName(name));
    const { data: products, loading: productsLoading, error: productsError, refetch, reset } = useFetch(() => fetchProductsByCategory(category?._id), false); 
    useEffect(() => {
        if (category?._id) 
            refetch();
        else
            reset();
    }, [category?._id]);

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

    const scrollToProducts = () => {
        scrollViewRef.current?.scrollTo({
        y: height,
        animated: true,
        });
    };

    return (
        <>
            {categoryLoading ? (
                <ActivityIndicator />
            ) : categoryError ? (
                <Text>Error: {categoryError}</Text>
            ) : (
                <View className="flex-1">
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
                            image={category?.image}
                            title={category?.name}
                            description={category?.description}
                            buttonText="Products"
                            onButtonPress={scrollToProducts}
                            imageOpacity={imageOpacity}
                            imageScale={imageScale}
                            textOpacity={textOpacity}
                            height={height}
                        />

                        {/* White Section */}
                        <View className="bg-white p-2">
                            {productsLoading ? (
                                <ActivityIndicator />
                            ) : productsError ? (
                                <Text>Error: {productsError}</Text>
                            ) : (
                                <View className="flex-row flex-wrap">
                                    {products?.map(product => (
                                        <View key={product._id} className="w-1/2 p-2">
                                            <ProductCard product={product}/>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}
        </>
    )
};

export default Category