import React, { useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;
const SIDE_CARD_WIDTH = width * 0.25;

function mod(n, m) {
  return ((n % m) + m) % m;
}

const FeaturedProductsCarousel = ({ products = [] }) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const total = products.length;

  if (!Array.isArray(products) || total === 0) return null;

  // Get indices for left, center, right
  const leftIndex = mod(centerIndex - 1, total);
  const rightIndex = mod(centerIndex + 1, total);

  const handleCardPress = (index) => {
    if (index === leftIndex) {
      setCenterIndex(leftIndex);
    } else if (index === rightIndex) {
      setCenterIndex(rightIndex);
    }
  };

  return (
    <View className="relative w-full h-96 flex flex-row items-center justify-center my-8 bg-transparent">
      {/* Left Card */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute left-0 z-10"
        style={{ width: SIDE_CARD_WIDTH, height: 320 }}
        onPress={() => handleCardPress(leftIndex)}
      >
        <View className="scale-90 opacity-70">
          <ProductCard product={products[leftIndex]} />
        </View>
      </TouchableOpacity>
      {/* Center Card */}
      <View
        className="absolute z-20"
        style={{ left: width / 2 - CARD_WIDTH / 2, width: CARD_WIDTH, height: 340 }}
      >
        <View className="scale-100">
          <ProductCard product={products[centerIndex]} />
        </View>
      </View>
      {/* Right Card */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute right-0 z-10"
        style={{ width: SIDE_CARD_WIDTH, height: 320 }}
        onPress={() => handleCardPress(rightIndex)}
      >
        <View className="scale-90 opacity-70">
          <ProductCard product={products[rightIndex]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FeaturedProductsCarousel; 