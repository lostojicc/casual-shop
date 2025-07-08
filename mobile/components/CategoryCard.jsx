import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity
      className="w-full h-48 relative"
      style={{ width }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: category.image }}
        className="w-full h-full absolute top-0 left-0"
        resizeMode="cover"
      />
      <View className="absolute top-0 left-0 w-full h-full bg-black/40" />
      <View className="absolute w-full h-full items-center justify-center">
        <TouchableOpacity
          className="border-2 border-white px-8 py-4"
          style={{}}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg text-center">
            {category.name}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
} 