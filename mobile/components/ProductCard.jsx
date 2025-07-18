import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useCartStore } from '../store/cartStore.js'
import { useAuthStore } from '../store/authStore.js'

const ProductCard = ({product}) => {
    const { addToCart } = useCartStore();
    const { token } = useAuthStore();
  return (
    <TouchableOpacity className="w-full h-80 bg-white shadow-lg shadow-black rounded-none overflow-hidden relative">
        <View className="h-1/2 w-full">
            <Image
                source={{ uri: product.image }}
                className="w-full h-full"
                resizeMode='cover'
            />
        </View> 
        <View className="h-1/2 w-full bg-white p-3 justify-between">
            <Text className="text-xs text-gray-500">{product.brand}</Text>
            <Text className="text-base text-black font-semibold mt-1">{product.name}</Text>
            <Text className="text-lg text-black-600 font-bold mt-2">${product.price}</Text>
        </View>

        <TouchableOpacity
            className="absolute top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2 bg-black w-16 h-16 rounded-full items-center justify-center border-4 border-white"
            onPress={() => addToCart(product, token)}
        >
            <Ionicons name="cart" size={28} color="white" />
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default ProductCard;