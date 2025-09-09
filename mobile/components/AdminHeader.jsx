import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const AdminHeader = ({ title }) => {
  const router = useRouter()

  return (
    <View className="bg-white px-4 py-6 shadow-lg shadow-black flex-row items-center justify-between">
      <Text className="text-black text-2xl font-bold mb-1">{title}</Text>
      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="p-2"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="home" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default AdminHeader 