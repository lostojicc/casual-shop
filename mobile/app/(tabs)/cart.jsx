import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'expo-router';

const cart = () => {
    const { isAuthenticated, isCheckingAuth } = useAuthStore();
    const router = useRouter();
    
    useEffect(() => {
        if (!isCheckingAuth && !isAuthenticated)
            router.replace("/signin");
    }, [isAuthenticated, isCheckingAuth]);
    return (
        <View>
        <Text>cart</Text>
        </View>
    )
}

export default cart