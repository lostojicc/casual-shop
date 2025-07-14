import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const Verify = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const { error, isLoading, verifyEmail, clearError, user } = useAuthStore();
  const router = useRouter();
  const [localError, setLocalError] = useState(null);

  useFocusEffect(
      useCallback(() => {
        if (user)
          router.back();
        clearError();
      }, [])
    );

  const handleChange = (index, value) => {
    let newCode = [...code];
    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || '';
      }
      setCode(newCode);
      // Focus next empty or last
      const lastFilled = newCode.findIndex((d) => d === '');
      const focusIndex = lastFilled === -1 ? 5 : lastFilled;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value.replace(/[^0-9]/g, '');
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const codeStr = code.join('');
    if (codeStr.length !== 6) {
      setLocalError('Please enter the 6-digit code.');
      return;
    }
    setLocalError(null);
    
    const success = await verifyEmail(codeStr);
    if (success)
      router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View className="flex-1 px-6 py-12 justify-center">
        <Image
          source={require('../../assets/images/logo.png')}
          className="h-20 w-20 mx-auto mb-2"
          resizeMode="contain"
        />
        
        <Text className="text-center text-2xl font-bold tracking-tight text-gray-900 mt-4">
          Enter the 6-digit code sent to your email address to verify your account (make sure to check your spam folder). 
        </Text>
        {(error || localError) && (
          <View className="bg-red-300 border-red-500 border-solid border-2 rounded-none p-3 mt-4">
            <Text className="text-white text-center text-sm">{error || localError}</Text>
          </View>
        )}
        <View className="mt-10">
          <View className="flex-row justify-between mb-6">
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={el => (inputRefs.current[idx] = el)}
                value={digit}
                onChangeText={val => handleChange(idx, val)}
                onKeyPress={e => handleKeyDown(idx, e)}
                keyboardType="number-pad"
                maxLength={1}
                className="w-14 h-14 text-center text-xl font-bold bg-white border-2 border-gray-300 rounded-none focus:border-black"
                style={{ color: '#111827' }}
                returnKeyType={idx === 5 ? 'done' : 'next'}
                blurOnSubmit={idx === 5}
              />
            ))}
          </View>
          <TouchableOpacity
            className="w-full py-3 rounded-none items-center bg-black shadow-lg shadow-black"
            onPress={handleSubmit}
            disabled={isLoading || code.some(d => !d)}
          >
            <Text className="text-white font-semibold text-sm">
              {isLoading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Verify; 