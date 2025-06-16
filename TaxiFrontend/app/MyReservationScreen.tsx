import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import HeaderBar from '../components/HeaderBar';
import OrderCard from '../components/OrderCard';

import { useOrderStore } from '../app/stores/orderStore';
import { fetchActiveOrders } from '../lib/api'; // Предполагается, что этот метод возвращает список заказов

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
  const { setOrderId, setStep } = useOrderStore();
  const [ordersGrouped, setOrdersGrouped] = useState<OrderGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders: Order[] = await fetchActiveOrders();

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
        console.error('Ошибка загрузки бронирований', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleHelpPress = () => {
    router.push('/AllChatsSupport');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} accessible={true} accessibilityLabel="Экран мои бронирования">
        <Text style={styles.loadingText}>Загрузка бронирований...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} accessible={true} accessibilityLabel="Экран Мои бронирования">
      <HeaderBar title="Мои бронирования" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSpacer} />

        {ordersGrouped.length === 0 ? (
          <EmptyState message="У вас пока нет бронирований" />
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
                    onPress={() => {
                      setOrderId(order.id);
                      setStep(5);
                      router.push('/screens/MainScreen');
                    }}
                    onHelpPress={isLastOrder ? handleHelpPress : undefined}
                  />
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
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