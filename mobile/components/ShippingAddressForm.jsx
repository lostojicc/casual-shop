import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const ShippingAddressForm = ({ onAddressSubmit }) => {
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

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
    <View className="bg-white mx-auto my-4 w-11/12 shadow-lg shadow-black px-4 py-4">
      <Text className="text-black text-xl font-bold mb-4">Shipping Address</Text>
      
      <View className="space-y-3">
        <View>
          <Text className="text-black text-base mb-1">Full Name *</Text>
          <TextInput
            value={shippingAddress.name}
            onChangeText={(text) => updateField('name', text)}
            className="border border-black px-3 py-2 text-black"
            placeholder="Enter your full name"
            placeholderTextColor="#999999"
          />
          {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>}
        </View>

        <View>
          <Text className="text-black text-base mb-1">Address Line 1 *</Text>
          <TextInput
            value={shippingAddress.line1}
            onChangeText={(text) => updateField('line1', text)}
            className="border border-black px-3 py-2 text-black"
            placeholder="Street address"
            placeholderTextColor="#999999"
          />
          {errors.line1 && <Text className="text-red-500 text-sm mt-1">{errors.line1}</Text>}
        </View>

        <View>
          <Text className="text-black text-base mb-1">Address Line 2</Text>
          <TextInput
            value={shippingAddress.line2}
            onChangeText={(text) => updateField('line2', text)}
            className="border border-black px-3 py-2 text-black"
            placeholder="Apartment, suite, etc. (optional)"
            placeholderTextColor="#999999"
          />
        </View>

        <View className="flex-row space-x-2">
          <View className="flex-1">
            <Text className="text-black text-base mb-1">City *</Text>
            <TextInput
              value={shippingAddress.city}
              onChangeText={(text) => updateField('city', text)}
              className="border border-black px-3 py-2 text-black"
              placeholder="City"
              placeholderTextColor="#999999"
            />
            {errors.city && <Text className="text-red-500 text-sm mt-1">{errors.city}</Text>}
          </View>
          <View className="flex-1">
            <Text className="text-black text-base mb-1">Postal Code *</Text>
            <TextInput
              value={shippingAddress.postalCode}
              onChangeText={(text) => updateField('postalCode', text)}
              className="border border-black px-3 py-2 text-black"
              placeholder="Postal code"
              placeholderTextColor="#999999"
            />
            {errors.postalCode && <Text className="text-red-500 text-sm mt-1">{errors.postalCode}</Text>}
          </View>
        </View>

        <View>
          <Text className="text-black text-base mb-1">Country *</Text>
          <TextInput
            value={shippingAddress.country}
            onChangeText={(text) => updateField('country', text)}
            className="border border-black px-3 py-2 text-black"
            placeholder="Country"
            placeholderTextColor="#999999"
          />
          {errors.country && <Text className="text-red-500 text-sm mt-1">{errors.country}</Text>}
        </View>

        <View>
          <Text className="text-black text-base mb-1">Phone Number *</Text>
          <TextInput
            value={shippingAddress.phone}
            onChangeText={(text) => updateField('phone', text)}
            className="border border-black px-3 py-2 text-black"
            placeholder="Phone number"
            placeholderTextColor="#999999"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-black py-3 px-4 mt-4"
      >
        <Text className="text-white text-base font-semibold text-center">
          Continue to Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShippingAddressForm; 