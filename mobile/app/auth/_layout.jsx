import { Stack } from 'expo-router';
import React from 'react';

const AuthLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index'/>
        <Stack.Screen name='verify'/>
    </Stack>
  )
}

export default AuthLayout