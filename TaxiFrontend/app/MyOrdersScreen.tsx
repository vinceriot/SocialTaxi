import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import HeaderBar from '../components/HeaderBar';
import OrderCard from '../components/OrderCard';
import { fetchFinishOrders } from '../lib/api';
import OrderDetailsScreen from './OrderDetails';

type Order = {
  id: string;
  type: string;
  time: string;
  from: string;
  to: string;
  price?: number;
  date: string;
};

type OrderGroup = {
  dateLabel: string;
  orders: Order[];
};

export default function MyOrdersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [ordersGrouped, setOrdersGrouped] = useState<OrderGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders: Order[] = await fetchFinishOrders();

        const sortedOrders = [...orders].sort((a, b) => {
          const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateDiff !== 0) return dateDiff;

          const timeA = a.time.split(':').map(Number);
          const timeB = b.time.split(':').map(Number);
          return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        });

        const grouped: Record<string, Order[]> = {};
        for (const order of sortedOrders) {
          const date = new Date(order.date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            weekday: 'long',
          });
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(order);
        }

        const result: OrderGroup[] = Object.entries(grouped)
          .map(([dateLabel, orders]) => ({
            dateLabel,
            originalDate: new Date(orders[0].date),
            orders,
          }))
          .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());

        setOrdersGrouped(result.map(({ dateLabel, orders }) => ({ dateLabel, orders })));
      } catch (error) {
        console.error('Ошибка загрузки заказов', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleHelpPress = () => {
    router.push('/AllChatsSupport');
  };

  const handleClose = () => setSelectedOrderId(null);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} accessible={true} accessibilityLabel="Экран Мои заказы">
        <Text style={styles.loadingText}>Загрузка заказов...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} accessible={true} accessibilityLabel="Экран Мои заказы">
      <HeaderBar title="Мои заказы" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSpacer} />

        {ordersGrouped.length === 0 ? (
          <EmptyState message="У вас пока нет заказов" />
        ) : (
          ordersGrouped.map((group, groupIndex) => (
            <View key={group.dateLabel} style={styles.group}>
              <Text accessibilityRole="header" accessible={true} style={styles.groupTitle}>
                {group.dateLabel}
              </Text>

              {group.orders.map((order, orderIndex) => {
                const isLastOrder = groupIndex === 0 && orderIndex === 0;

                return (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isLastOrder={isLastOrder}
                    onPress={() => setSelectedOrderId(order.id)}
                    onHelpPress={isLastOrder ? handleHelpPress : undefined}
                  />
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      {selectedOrderId && (
        <OrderDetailsScreen
          orderId={selectedOrderId}
          visible={true}
          onClose={handleClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingText: {
    padding: 24,
    fontSize: 16,
    color: '#666',
  },
  headerSpacer: {
    height: 16,
  },
  group: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
});