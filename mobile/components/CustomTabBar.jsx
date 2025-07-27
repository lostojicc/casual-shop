import React from 'react';
import { Text, View } from 'react-native';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View className="flex-row bg-white shadow-lg shadow-black" style={{
      height: 60,
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={route.key}
            className={`flex-1 items-center justify-center ${isFocused ? 'bg-black shadow-lg shadow-black' : 'bg-white shadow-lg shadow-black'}`}
            style={{
              paddingVertical: 8,
              marginHorizontal: 0,
              borderRadius: 0,
            }}
            onTouchEnd={onPress}
          >
            {options.tabBarIcon?.({ 
              color: isFocused ? '#ffffff' : '#000000', 
              size: 24 
            })}
            <Text 
              className={`text-xs font-bold mt-1 ${isFocused ? 'text-white' : 'text-black'}`}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar; 