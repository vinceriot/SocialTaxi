// components/OrderCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  order: {
    id: string;
    type: string;
    time: string;
    from: string;
    to: string;
    price?: number;
  };
  isLastOrder: boolean;
  onPress: () => void;
  onHelpPress?: () => void;
};

export default function OrderCard({ order, isLastOrder, onPress, onHelpPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Заказ ${order.type} в ${order.time}. От ${order.from} до ${order.to}.`}
      style={[styles.card, isLastOrder ? styles.lastCard : styles.prevCard]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.typeText}>
          {order.type === 'car' ? 'Легковой' : order.type === 'minivan' ? 'Специальный' : order.type} • {order.time}
        </Text>
        <Text style={styles.price}>{order.price ? `${order.price} ₽` : '—'}</Text>
      </View>

      {isLastOrder ? (
        <>
          <View style={styles.addressContainer}>
            <View style={styles.dot} />
            <Text style={styles.addressText}>{order.from}</Text>
          </View>
          <View style={styles.addressContainer}>
            <View style={[styles.dot, styles.hollowDot]} />
            <Text style={styles.addressText}>{order.to}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.compactAddressText} numberOfLines={1} ellipsizeMode="tail">
          {order.from} → {order.to}
        </Text>
      )}

      {isLastOrder && onHelpPress && (
        <TouchableOpacity
          style={styles.helpBlock}
          onPress={onHelpPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Помощь с заказом"
        >
          <Text style={styles.helpText}>Помощь с заказом →</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lastCard: {
    // ничего не добавляем, просто стиль по умолчанию
  },
  prevCard: {
    // для совместимости, но фактически не нужен — можно убрать, если одинаковые
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  hollowDot: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  addressText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  compactAddressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  helpBlock: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  helpText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
});