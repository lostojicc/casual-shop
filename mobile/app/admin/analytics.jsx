import React, { useState, useCallback, useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import AdminHeader from '../../components/AdminHeader'
import useFetch from '../../hooks/useFetch'
import { Ionicons } from '@expo/vector-icons'
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit'
import { fetchKpis, fetchMetricsOverTime, fetchTopProducts, fetchRevenueByCategory } from '../../api/analytics'

const analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  useEffect(() => {
    const now = new Date()
    let from, to

    switch (selectedPeriod) {
      case '7d':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        to = now
        break
      case '30d':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        to = now
        break
      case '90d':
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        to = now
        break
      case 'all':
      default:
        from = null
        to = null
        break
    }

    setDateRange({ from, to })
  }, [selectedPeriod])

  const fetchKpisWithDates = useCallback(() => fetchKpis(dateRange.from, dateRange.to), [dateRange])
  const fetchMetricsWithDates = useCallback(() => fetchMetricsOverTime(dateRange.from, dateRange.to), [dateRange])
  const fetchTopProductsWithDates = useCallback(() => fetchTopProducts(dateRange.from, dateRange.to, 10), [dateRange])
  const fetchCategoryWithDates = useCallback(() => fetchRevenueByCategory(dateRange.from, dateRange.to), [dateRange])

  const { data: kpis, loading: kpisLoading, refetch: refetchKpis } = useFetch(fetchKpisWithDates, false)
  const { data: metricsData, loading: metricsLoading, refetch: refetchMetrics } = useFetch(fetchMetricsWithDates, false)
  const { data: topProducts, loading: topProductsLoading, refetch: refetchTopProducts } = useFetch(fetchTopProductsWithDates, false)
  const { data: categoryData, loading: categoryLoading, refetch: refetchCategory } = useFetch(fetchCategoryWithDates, false)

  useEffect(() => {
    if (dateRange.from !== null || dateRange.to !== null || selectedPeriod === 'all') {
      refetchKpis()
      refetchMetrics()
      refetchTopProducts()
      refetchCategory()
    }
  }, [selectedPeriod, dateRange])

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchKpis(), refetchMetrics(), refetchTopProducts(), refetchCategory()])
  }, [refetchKpis, refetchMetrics, refetchTopProducts, refetchCategory])

  const formatCurrency = (amount) => `€${amount.toLocaleString()}`
  const formatNumber = (num) => num.toLocaleString();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // e.g. Sep 9
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 96 }}>
      <AdminHeader title="Analytics" />

      <View className="px-3 py-4">
        <View className="flex-row bg-white shadow-lg shadow-black">
          {['7d', '30d', '90d', 'all'].map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              className={`flex-1 py-3 items-center ${selectedPeriod === period ? 'bg-black' : 'bg-white'}`}
            >
              <Text className={`font-semibold text-sm ${selectedPeriod === period ? 'text-white' : 'text-black'}`}>
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="px-3 pb-6">
        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2 mb-4">
            <View className="bg-white shadow-lg shadow-black p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="trending-up" size={20} color="#000" />
                <Text className="text-xs text-gray-500">Revenue</Text>
              </View>
              <Text className="text-2xl font-bold text-black">{formatCurrency(kpis?.grossRevenue || 0)}</Text>
            </View>
          </View>

          <View className="w-1/2 px-2 mb-4">
            <View className="bg-white shadow-lg shadow-black p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="receipt" size={20} color="#000" />
                <Text className="text-xs text-gray-500">Orders</Text>
              </View>
              <Text className="text-2xl font-bold text-black">{formatNumber(kpis?.orders || 0)}</Text>
            </View>
          </View>

          <View className="w-1/2 px-2 mb-4">
            <View className="bg-white shadow-lg shadow-black p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="wallet" size={20} color="#000" />
                <Text className="text-xs text-gray-500">AOV</Text>
              </View>
              <Text className="text-2xl font-bold text-black">{formatCurrency(kpis?.aov || 0)}</Text>
            </View>
          </View>

          <View className="w-1/2 px-2 mb-4">
            <View className="bg-white shadow-lg shadow-black p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="cube" size={20} color="#000" />
                <Text className="text-xs text-gray-500">Units Sold</Text>
              </View>
              <Text className="text-2xl font-bold text-black">{formatNumber(kpis?.unitsSold || 0)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-3 pb-6">
        <Text className="text-lg font-bold text-black mb-4">Performance Overview</Text>

        <View className="bg-white shadow-lg shadow-black p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-black">Revenue Over Time</Text>
            <Ionicons name="bar-chart" size={20} color="#000" />
          </View>
          {metricsData?.series?.length > 0 ? (
            <LineChart
              data={{
                labels: metricsData.series.map((point) => formatDate(point.date)),
                datasets: [
                  {
                    data: metricsData.series.map((point) => point.revenue),
                    color: () => '#000000', // line color
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 48} // padding px-6
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: () => '#000000',
                labelColor: () => '#000000',
                propsForDots: {
                  r: '3',
                  strokeWidth: '1',
                  stroke: '#000000',
                },
              }}
              bezier
              style={{ borderRadius: 8 }}
            />
          ) : (
            <View className="h-32 bg-gray-100 items-center justify-center">
              <Text className="text-gray-500">No revenue data available</Text>
            </View>
          )}
        </View>

        <View className="bg-white shadow-lg shadow-black p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-black">Orders Over Time</Text>
            <Ionicons name="trending-up" size={20} color="#000" />
          </View>
          {metricsData?.series?.length > 0 ? (
    <BarChart
      data={{
        labels: metricsData.series.map((point) =>
          new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
          {
            data: metricsData.series.map((point) => point.orders),
          },
        ],
      }}
      width={Dimensions.get('window').width - 48}
      height={220}
      showValuesOnTopOfBars
      chartConfig={{
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: () => '#000000', // bar color
        labelColor: () => '#000000', // X-axis labels
      }}
      fromZero
      style={{ borderRadius: 8 }}
      withInnerLines={true} // removes inner grid lines
    />
  ) : (
    <View className="h-32 bg-gray-100 items-center justify-center">
      <Text className="text-gray-500">No orders data available</Text>
    </View>
  )}
        </View>
      </View>

      <View className="px-3 pb-6">
        <Text className="text-lg font-bold text-black mb-4">Top Products</Text>
        <View className="bg-white shadow-lg shadow-black">
          {topProducts?.items?.slice(0, 5).map((product, index) => (
            <View key={index} className={`p-4 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-black" numberOfLines={1}>{product.name}</Text>
                  <Text className="text-xs text-gray-500">{product.brand}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-black">{formatCurrency(product.revenue)}</Text>
                  <Text className="text-xs text-gray-500">{product.units} units</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="px-3 pb-6">
        <Text className="text-lg font-bold text-black mb-4">Revenue by Category</Text>
        <View className="bg-white shadow-lg shadow-black p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-black">Category Breakdown</Text>
            <Ionicons name="pie-chart" size={20} color="#000" />
          </View>
          {categoryData?.items?.length > 0 ? (
            <PieChart
              data={categoryData.items.map((item, index) => ({
                name: item.categoryName,
                revenue: item.revenue,
                color: [
                  '#000000', // red
                  '#333333', // teal
                  '#666666', // yellow
                  '#999999', // purple
                  '#CCCCCC', // dark teal
                ][index % 5],
                legendFontColor: '#000000',
                legendFontSize: 12,
              }))}
              width={Dimensions.get('window').width - 48} // padding (px-6)
              height={220}
              chartConfig={{
                color: () => '#000000',
                labelColor: () => '#000000',
              }}
              accessor="revenue"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // shows raw values instead of %
            />
          ) : (
            <View className="h-32 bg-gray-100 items-center justify-center">
              <Text className="text-gray-500">No category data available</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
};

export default analytics