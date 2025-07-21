import { Tabs } from 'expo-router'
import React from 'react'

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarStyle: { display: "none" }, headerShown: false }}>
        <Tabs.Screen name="index"/>
        <Tabs.Screen name="cart"/>
        <Tabs.Screen name="checkout"/>
    </Tabs>
  )
}

export default TabLayout