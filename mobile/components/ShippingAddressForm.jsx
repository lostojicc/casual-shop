import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const ShippingAddressForm = ({ onAddressSubmit, initialAddress }) => {
  const emptyAddress = {
    name: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  };
  const [shippingAddress, setShippingAddress] = useState(initialAddress || emptyAddress);

  useEffect(() => {
    setShippingAddress(initialAddress || emptyAddress);
  }, [initialAddress]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!shippingAddress.name.trim()) newErrors.name = 'Name is required';
    if (!shippingAddress.line1.trim()) newErrors.line1 = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!shippingAddress.country.trim()) newErrors.country = 'Country is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddressSubmit(shippingAddress);
    }
  };

  const updateField = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View className="w-full">
      <View className="space-y-5">
        <View>
          <Text className="text-black text-base font-semibold mb-1">Full Name *</Text>
          <TextInput
            value={shippingAddress.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Enter your full name"
            placeholderTextColor="#999999"
            className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
          />
          {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
        </View>
        <View>
          <Text className="text-black text-base font-semibold mb-1">Address Line 1 *</Text>
          <TextInput
            value={shippingAddress.line1}
            onChangeText={(text) => updateField('line1', text)}
            placeholder="Street address"
            placeholderTextColor="#999999"
            className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.line1 ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
          />
          {errors.line1 && <Text className="text-red-500 text-xs mt-1">{errors.line1}</Text>}
        </View>
        <View>
          <Text className="text-black text-base font-semibold mb-1">Address Line 2</Text>
          <TextInput
            value={shippingAddress.line2}
            onChangeText={(text) => updateField('line2', text)}
            placeholder="Apartment, suite, etc. (optional)"
            placeholderTextColor="#999999"
            className="w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-black-600"
          />
        </View>
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="text-black text-base font-semibold mb-1">City *</Text>
            <TextInput
              value={shippingAddress.city}
              onChangeText={(text) => updateField('city', text)}
              placeholder="City"
              placeholderTextColor="#999999"
              className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
            />
            {errors.city && <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>}
          </View>
          <View className="flex-1">
            <Text className="text-black text-base font-semibold mb-1">Postal Code *</Text>
            <TextInput
              value={shippingAddress.postalCode}
              onChangeText={(text) => updateField('postalCode', text)}
              placeholder="Postal code"
              placeholderTextColor="#999999"
              className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
            />
            {errors.postalCode && <Text className="text-red-500 text-xs mt-1">{errors.postalCode}</Text>}
          </View>
        </View>
        <View>
          <Text className="text-black text-base font-semibold mb-1">Country *</Text>
          <TextInput
            value={shippingAddress.country}
            onChangeText={(text) => updateField('country', text)}
            placeholder="Country"
            placeholderTextColor="#999999"
            className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
          />
          {errors.country && <Text className="text-red-500 text-xs mt-1">{errors.country}</Text>}
        </View>
        <View>
          <Text className="text-black text-base font-semibold mb-1">Phone Number *</Text>
          <TextInput
            value={shippingAddress.phone}
            onChangeText={(text) => updateField('phone', text)}
            placeholder="Phone number"
            placeholderTextColor="#999999"
            keyboardType="phone-pad"
            className={`w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-black-600`}
          />
          {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>}
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-full py-3 bg-black items-center shadow-lg shadow-black rounded-none mt-6"
      >
        <Text className="text-white font-semibold text-base">
          Continue to Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShippingAddressForm; 