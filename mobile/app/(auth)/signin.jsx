import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useAuthStore } from '../../store/authStore';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { signIn, isLoading, error, clearError, user } = useAuthStore();
    const router = useRouter();

    useFocusEffect(
      useCallback(() => {
        if (user)
          router.back();
        clearError();
      }, [])
    );

    const handleSignIn = async () => {
        let newErrors = {};
        if (!email) 
            newErrors.email = "Email is required";
        else if (!validateEmail(email)) 
            newErrors.email = "Please enter a valid email";
        
        if (!password) 
            newErrors.password = "Password is required";
        else if (password.length < 6) 
            newErrors.password = "Password must be at least 6 characters";
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        const needVerification = await signIn({ email, password });

        if (needVerification)
          router.push("/verify");
        else if (needVerification == false)
          router.back();
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            {/* X Button at the top left using Feather icon */}
            <TouchableOpacity
                className="absolute top-8 left-5 z-10"
                onPress={() => router.replace("/(tabs)")}
            >
                <Feather name="x" size={32} color="black" />
            </TouchableOpacity>
            {/* Main content */}
            <View className="flex-1 px-6 py-12 justify-center">
                <Image
                    source={require("../../assets/images/logo.png")}
                    className="h-20 w-20 mx-auto mb-2"
                    resizeMode="contain"
                />
                {/* Error box from store */}
                <Text className="text-center text-2xl font-bold tracking-tight text-gray-900 mt-4">
                    Sign in to your account
                </Text>
                {error && (
                    <View className="bg-red-300 border-red-500 border-solid border-2 rounded-none p-3 mt-4">
                        <Text className="text-white text-center text-sm">{error}</Text>
                    </View>
                )}
                {/* Form */}
                <View className="mt-10">
                    {/* Email field */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-900 mb-2">Email address</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-black-600"
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                        )}
                    </View>
                    {/* Password field */}
                    <View className="mb-6">
                        <View className="flex flex-row justify-between mb-2">
                            <Text className="text-sm font-medium text-gray-900">Password</Text>
                            <TouchableOpacity>
                                <Text className="text-sm font-semibold text-black-600">Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="relative">
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                secureTextEntry={!showPassword}
                                className="w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-black-600 pr-12"
                            />
                            <TouchableOpacity
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onPress={() => setShowPassword((prev) => !prev)}
                            >
                                <Feather
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && (
                            <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
                        )}
                    </View>
                    {/* Error box from store */}
                    
                    {/* Submit button with cool gradient */}
                    <TouchableOpacity
                        className="w-full py-3 rounded-none items-center bg-black shadow-lg shadow-black"
                        onPress={handleSignIn}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-semibold text-sm">
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Text>
                    </TouchableOpacity>
                    {/* Footer link */}
                    <View className="flex-row justify-center mt-10">
                      <Text className="text-sm text-gray-500">Don't have an account? </Text>
                      <TouchableOpacity onPress={() => router.replace("/signup")}>
                        <Text className="text-sm font-semibold text-black">Sign up</Text>
                      </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default signin