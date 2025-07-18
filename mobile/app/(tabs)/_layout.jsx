import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarStyle: { display: "none" }, headerShown: false }}>
        <Tabs.Screen name="index"/>
        <Tabs.Screen name="cart"/>
    </Tabs>
  )
}

export default TabLayout