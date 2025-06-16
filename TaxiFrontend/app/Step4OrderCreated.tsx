// app/screens/Step4OrderCreated.tsx

import { differenceInMinutes, format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS, FONT_SIZE, SPACING } from '../app/constants/theme';
import { useCurrentOrderStore } from '../app/stores/currentOrderStore';
import ActionButton from '../components/ActionButton';
import DriverInfo from '../components/DriverInfo';
import ListItem from '../components/ListItem';
import SectionSeparator from '../components/SectionSeparator';
import { cancelOrder } from '../lib/api'; // убедись, что путь корректный

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Конфиг для разных статусов
const statusConfig: Record<
  number,
  {
    title: string;
    description: string;
    actions: { key: string; label: string; icon: string; onPressKey: string }[];
  }
> = {
  1: {
    title: 'Ожидает подтверждения',
    description: 'Ждем подтверждения диспетчера',
    actions: [
      { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
  2: {
    title: 'Заказ подтверждён',
    description: 'Информация о водителе появится ближе к поездке',
    actions: [
      { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
  3: {
    title: 'В пути к вам',
    description: 'Водитель принял заказ и едет к вам',
    actions: [
      { key: 'call', label: 'Позвонить', icon: 'phone', onPressKey: 'handleContactPress' },
      { key: 'chat', label: 'Чат', icon: 'chat', onPressKey: 'handleContactPress' },
      { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
  4: {
    title: 'Водитель на месте',
    description: 'Водитель прибыл по адресу отправления',
    actions: [
      { key: 'call', label: 'Позвонить', icon: 'phone', onPressKey: 'handleContactPress' },
      { key: 'chat', label: 'Чат', icon: 'chat', onPressKey: 'handleContactPress' },
       { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
  5: {
    title: 'Поездка в пути',
    description: 'Пользователь находится в поездке',
    actions: [
      { key: 'call', label: 'Позвонить', icon: 'phone', onPressKey: 'handleContactPress' },
      { key: 'chat', label: 'Чат', icon: 'chat', onPressKey: 'handleContactPress'},
       { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
  6: {
    title: 'Завершено',
    description: 'Поездка завершена',
    actions: [
      { key: 'carrier', label: 'Детали', icon: 'info', onPressKey: 'handleCarrierDetailsPress' },
      { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
  7: {
    title: 'Отменено',
    description: 'Заказ отменён',
    actions: [
      { key: 'disp', label: 'Диспетчер', icon: 'support-agent', onPressKey: 'handleSafetyPress' },
    ],
  },
};

interface Step4OrderCreatedProps {
  orderId: string;
  onClose: () => void;
  onCancelOrder: () => void;
  onContactDispatcher: () => void;
  onContactDriver: () => void;
}

export default function Step4OrderCreated({
  orderId,
  onClose,
  onCancelOrder,
  onContactDispatcher,
  onContactDriver,
}: Step4OrderCreatedProps) {
  const router = useRouter();
  const { order, loading, error, loadOrder, refreshOrder } = useCurrentOrderStore();

  // Загрузка заказа
  useEffect(() => {
    if (orderId && (!order || order.id !== orderId)) {
      loadOrder(orderId);
    }
  }, [orderId]);

  // Периодический рефреш
  useEffect(() => {
    const id = setInterval(() => {
      if (order?.id) refreshOrder();
    }, 3000);
    return () => clearInterval(id);
  }, [order]);

  // Локальный стейт для ETA и переключатель
  const [etaMinutes, setEtaMinutes] = useState<number>(0);
  const [showMyLocation, setShowMyLocation] = useState<boolean>(false);

  const bottomSheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Считаем ETA
  useEffect(() => {
    if (!order || order.segments.length === 0 || !order.segments[0].departureTime) {
      setEtaMinutes(0);
      return;
    }
    const dep = parseISO(order.segments[0].departureTime);
    setEtaMinutes(Math.max(0, differenceInMinutes(dep, new Date())));
  }, [order]);

  // Анимации и обновление ETA каждую минуту
  useEffect(() => {
    Animated.timing(bottomSheetTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      closeBottomSheet();
      return true;
    });

    const interval = setInterval(() => {
      if (order && order.segments.length && order.segments[0].departureTime) {
        const dep = parseISO(order.segments[0].departureTime);
        setEtaMinutes(Math.max(0, differenceInMinutes(dep, new Date())));
      } else {
        setEtaMinutes(0);
      }
    }, 60000);

    return () => {
      backHandler.remove();
      clearInterval(interval);
    };
  }, [order]);

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetTranslateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(onClose);
  };

  // Обработчики кнопок
  const handleContactPress = () => {
    if (order?.segments[0].driver?.id) {
      onContactDriver();
    }
  };
  const handleSafetyPress = () => {
    router.push('/AllChatsSupport');
  };
  const handleSharePress = () => {
    // Share API
  };
  const handlePoddachaPress = () => {};
  const handleAddStopPress = () => {};
  const handleArrivalPress = () => {};
  const handleProblemPress = () => {};
  const handleChangePaymentPress = () => {};
  const handleCarrierDetailsPress = () => {};
  const handleCancelTripPress = () => {
    if (!order?.id) return;

    Alert.alert(
      'Отменить поездку',
      'Вы уверены, что хотите отменить эту поездку?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да',
          onPress: async () => {
            try {
              await cancelOrder(order.id);
              onCancelOrder();
            } catch (error) {
              console.error('Ошибка при отмене заказа', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Map of handler functions for action buttons
  const handlers: Record<string, () => void> = {
    handleContactPress,
    handleSafetyPress,
    handleSharePress,
    handlePoddachaPress,
    handleAddStopPress,
    handleArrivalPress,
    handleProblemPress,
    handleChangePaymentPress,
    handleCarrierDetailsPress,
    handleCancelTripPress,
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => order?.id && loadOrder(order.id)}>
          <Text style={styles.retryText}>Попробовать снова</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Нет активного заказа</Text>
      </SafeAreaView>
    );
  }

  const cfg = statusConfig[order.status.id] || statusConfig[1];

  return (
    <SafeAreaView style={styles.container}>
      {loading && !order && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <View style={styles.mapPlaceholder} />

      <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: bottomSheetTranslateY }] }]}>
        <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={COLORS.icon} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Заголовок со статусом */}
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, { color: cfg.color }]}>{cfg.title}</Text>
            <View style={styles.headerDivider} />
          </View>

          {/* Описание статуса */}
          <Text style={styles.statusDescription}>{cfg.description}</Text>

          {/* Сегменты поездки (только после назначения водителя) */}
          {order.segments
            .filter((segment) => segment.driver && segment.vehicle)
            .map((segment) => {
              const dep = segment.departureTime ? parseISO(segment.departureTime) : null;
              const arr = segment.arrivalTime ? parseISO(segment.arrivalTime) : null;
              return (
                <View key={segment.id} style={styles.segmentCard}>
                  <DriverInfo
                    name={`${segment.driver.firstName} ${segment.driver.lastName}`}
                    rating={segment.driver.rating}
                    carModel={segment.vehicle.brand + ' ' + segment.vehicle.model}
                    plateNumber={segment.vehicle.licensePlate}
                    specialEquipment={segment.vehicle.specialEquipment}
                  />
                </View>
              );
            })}

          {/* Кнопки действий */}
          <View style={styles.actionsRow}>
            {cfg.actions.map((act) => (
              <ActionButton
                key={act.key}
                iconName={act.icon}
                label={act.label}
                onPress={handlers[act.onPressKey]}
              />
            ))}
          </View>

          {/* Дополнительные опции */}
          {order.comment && (
            <>
              <SectionSeparator />
              <ListItem leftIconName="chat" title="Комментарий" subtitle={order.comment} onPress={() => {}} />
            </>
          )}

          <SectionSeparator />

          {order.segments.length > 0 && order.segments[0].departureTime && (
            <>
              <ListItem
                leftIconName="directions-car"
                title={`Подача ≈${format(parseISO(order.segments[0].departureTime), 'HH:mm')}`}
                subtitle={`${order.segments[0].fromAddress.street} ${order.segments[0].fromAddress.house}`}
                onPress={handlePoddachaPress}
              />

              <ListItem
                leftIconName="flag"
                title="Прибытие"
                subtitle={`${order.segments[0].toAddress.street} ${order.segments[0].toAddress.house}`}
                onPress={handleArrivalPress}
              />
            </>
          )}

          <SectionSeparator />

          {/* <ListItem leftIconName="headset" title="У меня проблема" onPress={handleProblemPress} />*/}
          <SectionSeparator />

         {/*  <View style={styles.locationBlock}>
          <Text style={styles.locationText}>Показать водителю, где я</Text>
            <Switch value={showMyLocation} onValueChange={() => setShowMyLocation((v) => !v)} color={COLORS.switchActive} />
          </View>
 */}
          <SectionSeparator />

          {/* <ListItem
            leftIconName="info"
            title="Перевозчик и детали"
            subtitle={`${order.segments[0].driver?.firstName ?? ''} ${order.segments[0].driver?.lastName ?? ''}`}
            onPress={handleCarrierDetailsPress}
          /> */}

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelTripPress}>
            <MaterialIcons name="cancel" size={24} color={COLORS.danger} />
            <Text style={styles.cancelText}>Отменить поездку</Text>
          </TouchableOpacity>

          <View style={{ height: SPACING.lg }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  mapPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.grayLight },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SPACING.md,
    borderTopRightRadius: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, zIndex: 2, padding: SPACING.xs },
  scrollContainer: { paddingTop: SPACING.lg * 1.2, paddingBottom: SPACING.lg },
  headerContainer: { marginTop: SPACING.md, marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  headerText: { fontSize: FONT_SIZE.heading, fontWeight: '600' },
  headerDivider: { position: 'absolute', bottom: -SPACING.xs, left: 0, right: 0, borderBottomWidth: 1, borderColor: COLORS.grayBorder },
  statusDescription: { marginHorizontal: SPACING.md, marginBottom: SPACING.md, fontSize: FONT_SIZE.small, color: COLORS.grayText },
  segmentCard: { marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  segmentTime: { fontSize: FONT_SIZE.body, fontWeight: '600', color: COLORS.black },
  segmentAddress: { fontSize: FONT_SIZE.small, color: COLORS.grayText, marginBottom: SPACING.sm },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  locationBlock: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.md, paddingVertical: SPACING.sm * 1.3, borderBottomWidth: 1, borderColor: COLORS.grayBorder },
  locationText: { flex: 1, fontSize: FONT_SIZE.body, color: COLORS.black },
  cancelButton: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.md, paddingVertical: SPACING.sm * 1.3 },
  cancelText: { flex: 1, fontSize: FONT_SIZE.body, color: COLORS.danger, marginLeft: SPACING.sm * 1.5 },
  errorText: { flex: 1, textAlign: 'center', color: COLORS.danger, fontSize: FONT_SIZE.body, marginTop: SPACING.lg },
  retryText: { textAlign: 'center', color: COLORS.primary, fontSize: FONT_SIZE.body, marginTop: SPACING.sm },
  emptyText: { flex: 1, textAlign: 'center', color: COLORS.grayText, fontSize: FONT_SIZE.body, marginTop: SPACING.lg },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
});