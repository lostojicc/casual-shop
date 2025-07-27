import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useAuthStore } from '../store/authStore.js'
import { useCartStore } from '../store/cartStore.js'
import { useRouter } from 'expo-router'

const ProductCard = ({product}) => {
    const { addToCart } = useCartStore();
    const { token } = useAuthStore();
    const router = useRouter();
    
    // Fallback image if product.image is undefined
    const imageUrl = product.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
  return (
    <View className="w-full h-80 bg-white shadow-lg shadow-black rounded-none overflow-hidden relative">
        <View className="h-1/2 w-full">
            <Image
                source={{ uri: imageUrl }}
                className="w-full h-full"
                resizeMode='cover'
            />
        </View> 
        <View className="h-1/2 w-full bg-white p-3 justify-between">
            <Text className="text-xs text-gray-500" numberOfLines={1}>{product.brand || 'Brand'}</Text>
            <Text className="text-base text-black font-semibold mt-1">{product.name}</Text>
            <Text className="text-lg text-black-600 font-bold mt-2">€{product.price}</Text>
        </View>

        <TouchableOpacity
            className="absolute top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2 bg-black w-16 h-16 rounded-full items-center justify-center border-4 border-white"
            onPress={() => {
                if (token)
                    addToCart(product, token)
                else
                    router.push("/signin");
            }}
        >
            <Ionicons name="cart" size={28} color="white" />
        </TouchableOpacity>
    </View>
  )
}

export default ProductCard;