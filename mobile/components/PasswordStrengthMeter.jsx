import React from 'react';
import { View, Text } from 'react-native';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return 'bg-red-500';
    if (strength === 1) return 'bg-red-400';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <View className="mt-2">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-xs text-gray-400">Password strength</Text>
        <Text className="text-xs text-gray-400">{getStrengthText(strength)}</Text>
      </View>
      <View className="flex-row">
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            className={`h-1 flex-1 rounded-none mx-0.5 ${index < strength ? getColor(strength) : 'bg-gray-600'}`}
          />
        ))}
      </View>
    </View>
  );
};

export default PasswordStrengthMeter; 