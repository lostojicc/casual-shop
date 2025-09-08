import React, { useCallback } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import AdminHeader from '../../components/AdminHeader'
import AdminProductCard from '../../components/AdminProductCard'
import { deleteProductAdmin, fetchAllProductsAdmin, updateProductQuantityAdmin } from '../../api/products'
import useFetch from '../../hooks/useFetch'

const index = () => {
  const { data: products, loading, error, refetch } = useFetch(fetchAllProductsAdmin)

  const onRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateProductQuantityAdmin(productId, quantity)
      await refetch()
    } catch {}
  }
  const handleDelete = async (productId) => {
    try {
      await deleteProductAdmin(productId)
      await refetch()
    } catch {}
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AdminHeader title="Products" />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16, paddingBottom: 96 }}
        renderItem={({ item }) => (
          <AdminProductCard product={item} onUpdateQuantity={handleUpdateQuantity} onDelete={handleDelete} />
        )}
        refreshControl={<RefreshControl refreshing={!!loading} onRefresh={onRefresh} />}
        ListEmptyComponent={<View className="h-10" />}
      />
    </View>
  )
}

export default index