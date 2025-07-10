import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useAuthStore } from '../../store/authStore';

const signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, isLoading, user } = useAuthStore();

    const handleSignIn = async () => {
        const needVerification = await signIn({ email, password });

        if (!needVerification){
            console.log("Signed in");
            console.log(user);
        }
            
        else
            console.log("Verification");
    }

    return (
        <View className="flex-1 bg-white px-6 py-12 justify-center">
      {/* Top logo and title */}
      <View className="w-full max-w-sm self-center">
        <Image
          source={require("../../assets/images/logo.png")}
          className="h-20 w-20 mx-auto mb-2"
          resizeMode="contain"
        />
        <Text className="text-center text-2xl font-bold tracking-tight text-gray-900 mt-4">
          Sign in to your account
        </Text>

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
          </View>

          {/* Password field */}
          <View className="mb-6">
            <View className="flex flex-row justify-between mb-2">
              <Text className="text-sm font-medium text-gray-900">Password</Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-black-600">Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              className="w-full rounded-none bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-black-600"
            />
          </View>

          {/* Submit button with cool gradient */}
          <TouchableOpacity
            className="w-full py-3 rounded-none items-center bg-black shadow-lg shadow-black"
            onPress={() => handleSignIn()}
          >
            <Text className="text-white font-semibold text-sm">Sign in</Text>
          </TouchableOpacity>

          {/* Footer link */}
          <Text className="text-center text-sm text-gray-500 mt-10">
            Don't have an account?{" "}
            <Text className="font-semibold text-black">Sign up</Text>
          </Text>
        </View>
      </View>
    </View>
    )
}

export default signin