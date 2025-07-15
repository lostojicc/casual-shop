import { View, Text } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useFocusEffect, useRouter } from 'expo-router';

const cart = () => {
    const { token, isCheckingAuth } = useAuthStore();
    const router = useRouter();
    
    useFocusEffect(useCallback(() => {
        if (!isCheckingAuth && !token)
            router.replace("/signin");
    }, [token, isCheckingAuth]));
    return (
        <View>
        <Text>cart</Text>
        </View>
    )
}

export default cart