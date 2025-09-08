import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const AdminProductCard = ({ product, onUpdateQuantity, onDelete }) => {
  const brand = product.brand || 'Brand'
  const name = product.name || 'Product Name'
  const price = product.price || 0
  const imageUrl = product.image || 'https://via.placeholder.com/80x80.png?text=Img'
  const [qty, setQty] = useState(String(product.quantity ?? 0))

  const handleUpdate = () => {
    const parsed = parseInt(qty, 10)
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onUpdateQuantity?.(product._id, parsed)
    }
  }

  return (
    <View className="flex-row items-center bg-white w-full shadow-lg shadow-black px-4 py-3">
      {/* Image */}
      <Image
        source={{ uri: imageUrl }}
        className="w-20 h-20 mr-3"
        style={{ resizeMode: 'cover' }}
      />
      {/* Brand and Name */}
      <View className="flex-1 mr-2 min-w-[80px]">
        <Text className="text-xs text-gray-500" numberOfLines={1}>{brand}</Text>
        <Text className="text-base text-black font-semibold" numberOfLines={2}>{name}</Text>
      </View>
      {/* Right Controls (fixed width for alignment across cards) */}
      <View className="w-48 items-end ml-2">
        <View className="flex-row items-center">
          <TextInput
            value={qty}
            onChangeText={setQty}
            keyboardType="numeric"
            className="w-12 h-8 text-center text-black border border-black px-0 py-0 rounded-none bg-white"
          />
          <TouchableOpacity
            onPress={handleUpdate}
            className="h-8 px-3 bg-black items-center justify-center shadow-lg shadow-black rounded-none flex-row border border-black border-l-0"
          >
            <Ionicons name="refresh" size={14} color="#fff" />
            <Text className="text-white font-semibold text-xs ml-1">Update</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-2">
          <Text
            className="text-black text-base font-bold mr-2"
            numberOfLines={1}
          >
            €{price}
          </Text>
          <TouchableOpacity onPress={() => onDelete?.(product._id)}>
            <Ionicons name="trash" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AdminProductCard


