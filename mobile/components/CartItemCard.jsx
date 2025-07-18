import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CartItemCard = ({ item = {}, refetch }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const brand = item.brand || 'Brand';
  const name = item.name || 'Product Name';
  const price = item.price || 99.99;
  const imageUrl = item.image || 'https://via.placeholder.com/80x80.png?text=Img';

  // Unified handler for all quantity changes
  const handleQuantityChange = async (newQuantity) => {
    setQuantity(newQuantity);
    // Placeholder: call your API to update quantity in the database
    // await updateCartItemQuantity(item._id, safeQuantity);
    if (refetch) refetch();
  };

  const handleInputChange = (text) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    handleQuantityChange(isNaN(num) ? 1 : num);
  };

  return (
    <View className="flex-row items-center bg-white mx-auto my-4 w-11/12 shadow-lg shadow-black px-2 py-3">
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
      {/* Quantity Controls */}
      <View className="flex-row items-center mr-2 border border-black px-1 py-0.5">
        <TouchableOpacity onPress={() => handleQuantityChange(quantity - 1)} className="px-1">
          <Ionicons name="remove" size={18} color="black" />
        </TouchableOpacity>
        <TextInput
          className="w-8 text-center text-black mx-1 p-0"
          keyboardType="number-pad"
          value={quantity.toString()}
          onChangeText={handleInputChange}
          maxLength={3}
        />
        <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)} className="px-1">
          <Ionicons name="add" size={18} color="black" />
        </TouchableOpacity>
      </View>
      {/* Price */}
      <Text className="text-black text-base font-bold mr-3 min-w-[48px] text-right">${price}</Text>
      {/* Trash Icon */}
      <TouchableOpacity className="pl-2">
        <Ionicons name="trash" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CartItemCard; 