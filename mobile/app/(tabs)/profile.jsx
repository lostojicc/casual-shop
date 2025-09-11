import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore.js';
import Header from '../../components/Header.jsx';
import { useFocusEffect, useRouter } from 'expo-router';
import { fetchUserOrderHistory } from '../../api/orders.js';
import useFetch from '../../hooks/useFetch.js';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
    const { token, isCheckingAuth } = useAuthStore();
    const router = useRouter();

    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            if (!isCheckingAuth && !token) router.replace("/signin");
        }, [token, isCheckingAuth])
    );

    const { data: orders, loading, error, refetch } = useFetch(
        () => fetchUserOrderHistory(token),
        !!token
    );

    const toggleExpand = (id) => {
        setExpandedOrderId(prev => (prev === id ? null : id));
    };

    const renderOrderItem = ({ item }) => {
        const isExpanded = expandedOrderId === item._id;
        const subtotal = item.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

        return (
            <View className="bg-white w-11/12 mx-auto shadow-lg shadow-black px-0 py-0">
                {/* Order summary */}
                <TouchableOpacity
                    onPress={() => toggleExpand(item._id)}
                    className="flex-row justify-between items-center px-6 py-4"
                >
                    <View>
                        <Text className="text-black font-bold text-base">Order #{item._id.slice(-6)}</Text>
                        <Text className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <Ionicons
                        name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>

                {/* Expanded order details */}
                {isExpanded && (
                    <View className="divide-y divide-black px-6 py-4">
                        {item.items.map((i) => (
                            <View key={i.product._id} className="flex-row items-center py-4 bg-white">
                                <Image
                                    source={{ uri: i.product.image }}
                                    className="w-16 h-16 mr-4"
                                    style={{ resizeMode: 'cover' }}
                                />
                                <View className="flex-1 min-w-[80px]">
                                    <Text className="text-xs text-gray-500 mb-1">{i.product.brand}</Text>
                                    <Text className="text-base text-black font-semibold mb-1">{i.product.name}</Text>
                                    <Text className="text-xs text-gray-500">
                                        {i.quantity} × <Text className="text-black font-bold">€{i.price.toFixed(2)}</Text> each
                                    </Text>
                                </View>
                                <View className="items-end min-w-[80px]">
                                    <Text className="text-black text-lg font-bold">€{(i.price * i.quantity).toFixed(2)}</Text>
                                </View>
                            </View>
                        ))}

                        {/* Shipment info */}
                        <View className="py-4">
                            <Text className="text-black font-bold text-base mb-1">Shipment Info</Text>
                            <Text className="text-gray-500 text-sm">{item.shipping.name} - {item.shipping.phone}</Text>
                            <Text className="text-gray-500 text-sm">{item.shipping.line1}, {item.shipping.line2}</Text>
                            <Text className="text-gray-500 text-sm">{item.shipping.city}, {item.shipping.postalCode}</Text>
                            <Text className="text-gray-500 text-sm">{item.shipping.country}</Text>
                        </View>

                        {/* Total */}
                        <View className="pt-4">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-black text-base">Subtotal</Text>
                                <Text className="text-black text-base font-semibold">€{subtotal.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between border-t border-black pt-3 mt-2">
                                <Text className="text-black text-xl font-bold">Total</Text>
                                <Text className="text-black text-xl font-bold">€{item.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <>
            <Header isScrolled={true} opacity={1} />

            <View className="mt-20 bg-white px-4 py-6 shadow-lg shadow-black">
                <Text className="text-black text-2xl font-bold mb-1">Order History</Text>
            </View>

            {loading && <ActivityIndicator size="large" color="#000" className="mt-6" />}

            {error && <Text className="text-red-500 mt-4 text-center">{error.message}</Text>}

            {orders && orders.length === 0 && (
                <Text className="text-gray-500 mt-4 text-center">No orders found.</Text>
            )}

            {orders && orders.length > 0 && (
                <FlatList
                    className="mt-6"
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </>
    );
};

export default Profile;
