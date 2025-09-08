import React, { useState, useCallback, useEffect } from 'react'
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AdminHeader from '../../components/AdminHeader'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { addProduct } from '../../api/products.js';

const AddProduct = () => {
  const [form, setForm] = useState({
    brand: '',
    name: '',
    description: '',
    price: '',
    image: '',
    imageBase64: '',
    category: '',
  })

  const [errors, setErrors] = useState({})
  const [imageHeight, setImageHeight] = useState(0)

  useFocusEffect(
    useCallback(() => {
      return () => {
        setForm({ brand: '', name: '', description: '', price: '', image: '', imageBase64: '', category: '' })
        setErrors({})
      }
    }, [])
  )

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.brand.trim()) newErrors.brand = 'Brand is required'
    if (!form.name.trim()) newErrors.name = 'Product name is required'
    if (!form.price.toString().trim()) newErrors.price = 'Price is required'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) newErrors.price = 'Enter a valid price'
    if (!form.category.trim()) newErrors.category = 'Category is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const payload = {
      brand: form.brand.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      image: form.imageBase64 ? `data:image/jpeg;base64,${form.imageBase64}` : "",
    }
    try {
      await addProduct(payload)
      setForm({ brand: '', name: '', description: '', price: '', image: '', imageBase64: '', category: '' })
    } catch (e) {
      setErrors(prev => ({ ...prev, submit: e?.message || 'Failed to save product' }))
    }
  }

  const requestPermissionAndPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      setErrors(prev => ({ ...prev, image: 'Media library permission is required' }))
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
      base64: true,
    })
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      const uri = asset.uri
      const base64 = asset.base64 || ''
      updateField('image', uri)
      updateField('imageBase64', base64)
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  useEffect(() => {
    if (!form.image) {
      setImageHeight(0)
      return
    }
    const screenWidth = Dimensions.get('window').width
    const horizontalPadding = 24
    const availableWidth = screenWidth - horizontalPadding * 2
    Image.getSize(
      form.image,
      (w, h) => {
        if (w > 0) {
          const ratio = h / w
          setImageHeight(Math.max(1, Math.round(availableWidth * ratio)))
        }
      },
      () => {
        setImageHeight(240)
      }
    )
  }, [form.image])

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <AdminHeader title="Add Product" />
      <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 96 }}>
        <View className="space-y-6">
          <View>
            <Text className="text-black text-base font-semibold mb-1">Brand *</Text>
            <TextInput
              value={form.brand}
              onChangeText={(t) => updateField('brand', t)}
              placeholder="Brand name"
              placeholderTextColor="#999999"
              className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
            />
            {errors.brand ? <Text className="text-red-500 text-xs mt-1">{errors.brand}</Text> : null}
          </View>

          <View>
            <Text className="text-black text-base font-semibold mb-1">Product Name *</Text>
            <TextInput
              value={form.name}
              onChangeText={(t) => updateField('name', t)}
              placeholder="Product name"
              placeholderTextColor="#999999"
              className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
            />
            {errors.name ? <Text className="text-red-500 text-xs mt-1">{errors.name}</Text> : null}
          </View>

          <View>
            <Text className="text-black text-base font-semibold mb-1">Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(t) => updateField('description', t)}
              placeholder="Short description"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              className="w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-black-600"
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text className="text-black text-base font-semibold mb-1">Image</Text>
            <View className="space-y-4 mb-1">
              <TouchableOpacity
                onPress={requestPermissionAndPick}
                className="w-full py-3 bg-white items-center justify-center shadow-lg shadow-black rounded-none flex-row"
              >
                <Ionicons name="image" size={20} color="#000" />
                <Text className="text-black font-semibold text-base ml-2">Upload Image</Text>
              </TouchableOpacity>
              {form.image ? (
                <View className="bg-white shadow-lg shadow-black">
                  <Image
                    source={{ uri: form.image }}
                    style={{ width: '100%', height: imageHeight || undefined }}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View className="bg-white shadow-lg shadow-black h-48 items-center justify-center">
                  <Ionicons name="image-outline" size={28} color="#111827" />
                  <Text className="text-gray-500 text-xs mt-2">No image selected</Text>
                </View>
              )}
              {errors.image ? <Text className="text-red-500 text-xs">{errors.image}</Text> : null}
            </View>
          </View>

          <View>
            <Text className="text-black text-base font-semibold mb-1">Price (EUR) *</Text>
            <TextInput
              value={form.price}
              onChangeText={(t) => updateField('price', t)}
              placeholder="0.00"
              placeholderTextColor="#999999"
              keyboardType="decimal-pad"
              className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
            />
            {errors.price ? <Text className="text-red-500 text-xs mt-1">{errors.price}</Text> : null}
          </View>

          <View>
            <Text className="text-black text-base font-semibold mb-1">Category *</Text>
            <TextInput
              value={form.category}
              onChangeText={(t) => updateField('category', t)}
              placeholder="Category"
              placeholderTextColor="#999999"
              className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
            />
            {errors.category ? <Text className="text-red-500 text-xs mt-1">{errors.category}</Text> : null}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full py-3 bg-black items-center shadow-lg shadow-black rounded-none mt-6"
          >
            <Text className="text-white font-semibold text-base">Save Product</Text>
          </TouchableOpacity>
          <View className="h-8" />
        </View>
        {errors.submit ? <Text className="text-red-500 text-xs mt-1">{errors.submit}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AddProduct;