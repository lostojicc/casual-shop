import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import CustomTabBar from '../../components/CustomTabBar'

const AdminLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
        <Tabs.Screen 
          name="index" 
          options={{
            title: "Products",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetags" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="add-product" 
          options={{
            title: "Add Product",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="analytics" 
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
    </Tabs>
  )
}

export default AdminLayout;