// Step1FromTo.tsx
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAutoCalculatePrice } from '../hooks/autoCalculatePrice';
import { fetchActiveOrders } from '../lib/api';
import AddressSearchModal from './AddressSearchModalMenu';
import { useOrderStore } from './stores/orderStore';

export default function Step1FromTo({ styles: externalStyles }: { styles: any }) {
  const styles = { ...externalStyles, ...localStyles };

  // Локальные состояния для модалки поиска и ввода подъезда
  const [searchTarget, setSearchTarget] = useState<'from' | 'to' | null>(null);
  const [entranceModalVisible, setEntranceModalVisible] = useState(false);
  const [entranceTarget, setEntranceTarget] = useState<'from' | 'to' | null>(null);
  const [entranceInput, setEntranceInput] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoTransportType, setInfoTransportType] = useState<'car' | 'minivan' | null>(null);
  const entranceRef = useRef<TextInput>(null);

  useEffect(() => {
    if (entranceModalVisible && entranceRef.current) {
      // Delay allows modal to fully appear before focusing
      setTimeout(() => {
        entranceRef.current?.focus();
      }, 100);
    }
  }, [entranceModalVisible]);

  // Берём из зустандем-стора поля и методы:
  const {
    from,
    setFrom,
    to,
    setTo,
    setFromAddressDetails,
    setToAddressDetails,
    vehicleType,
    setVehicleType,
    setStep,
    setOrderId,
    fromEntrance,
    setFromEntrance,
    toEntrance,
    setToEntrance,
    routePrice, // добавлено
  } = useOrderStore();
  const router = useRouter();
  useAutoCalculatePrice();

  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    async function loadActiveOrder() {
      try {
        const orders: any[] = await fetchActiveOrders();
        console.log('Step1FromTo fetched active orders:', orders);
        const now = new Date();
        // Map API data to include a Date object for filtering
        const enriched = orders.map(o => ({
          ...o,
          departureDate: new Date(o.date),
        }));
        // Filter only future orders and pick the nearest
        const upcoming = enriched
          .filter(o => o.departureDate > now)
          .sort((a, b) => a.departureDate.getTime() - b.departureDate.getTime());
        if (upcoming.length) {
          setActiveOrder(upcoming[0]);
        }
      } catch (e) {
        console.error('Ошибка загрузки активного заказа:', e);
      }
    }
    loadActiveOrder();
  }, []);
  // Хук, который возвращает true, когда этот экран фокусируется (после router.back())
  const isFocused = useIsFocused();

  // Когда экран вновь становится активным, сбрасываем searchTarget → закрываем модалку
  useEffect(() => {
    if (isFocused) {
      setSearchTarget(null);
    }
  }, [isFocused]);

  // handleSelect теперь получает сразу заполненный объект addressDetails
  const handleSelect = (address: {
    latitude: string;
    longitude: string;
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
    entrance: string;
    postalCode: string;
    fullAddress: string;
  }) => {
    const fullAddress = address.fullAddress;
    if (searchTarget === 'from') {
      setFrom(fullAddress);
      setFromAddressDetails(address);
    } else if (searchTarget === 'to') {
      setTo(fullAddress);
      setToAddressDetails(address);
    }
    setSearchTarget(null);
  };

  return (
    <View style={styles.panel}>
      {/* Плашка активного заказа */}
      {activeOrder && (
        <TouchableOpacity
          style={[styles.orderBanner, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
          activeOpacity={0.7}
          onPress={() => {
            setOrderId(activeOrder.id);
            setStep(5);
            router.push('/screens/MainScreen');
          }}
        >
          <View>
            <Text style={styles.orderBannerTitle}>У вас уже оформлен заказ!</Text>
            <Text style={styles.orderBannerText}>
              {activeOrder.from.split(',').slice(0, 2).join(', ')},{" "}
              {new Date(activeOrder.date).toLocaleDateString('ru-RU')} к {activeOrder.time}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#256029" />
        </TouchableOpacity>
      )}
      {/* INPUT «Откуда» */}
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>A</Text>
        <TouchableOpacity
          onPress={() => setSearchTarget('from')}
          style={styles.addressField}
        >
          <Text style={from ? styles.addressText : styles.placeholderText}>
            {from || 'Откуда поедете?'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setEntranceTarget('from');
            setEntranceInput(fromEntrance || '');
            setEntranceModalVisible(true);
          }}
          style={styles.entranceButton}
        >
          <Text style={styles.entranceButtonText}>
            {fromEntrance ? `Подъезд ${fromEntrance}` : 'Подъезд'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* INPUT «Куда» */}
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>B</Text>
        <TouchableOpacity
          onPress={() => setSearchTarget('to')}
          style={styles.addressField}
        >
          <Text style={to ? styles.addressText : styles.placeholderText}>
            {to || 'Куда поедете?'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setEntranceTarget('to');
            setEntranceInput(toEntrance || '');
            setEntranceModalVisible(true);
          }}
          style={styles.entranceButton}
        >
          <Text style={styles.entranceButtonText}>
            {toEntrance ? `Подъезд ${toEntrance}` : 'Подъезд'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Выбор типа транспорта */}
      <View style={styles.vehicleContainer}>
        <TouchableOpacity
          style={[styles.vehicleOption, vehicleType === 'car' && styles.selectedOption]}
          onPress={() => {
            if (vehicleType !== 'car') {
              setVehicleType('car');
            } else {
              setInfoTransportType('car');
              setInfoModalVisible(true);
            }
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../assets/images/car.png')}
              style={{ width: 50, height: 30, resizeMode: 'contain', marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>Легковой</Text>
              {routePrice?.standard && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ textDecorationLine: 'line-through', color: '#888', fontSize: 12 }}>
                    {routePrice?.standard.full ?? '...'} ₽
                  </Text>
                  <Text style={{ color: '#256029', fontWeight: 'bold', fontSize: 14 }}>
                    {routePrice?.standard.discounted ?? '...'} ₽
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.vehicleOption, vehicleType === 'minivan' && styles.selectedOption]}
          onPress={() => {
            if (vehicleType !== 'minivan') {
              setVehicleType('minivan');
            } else {
              setInfoTransportType('minivan');
              setInfoModalVisible(true);
            }
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../assets/images/minivan.png')}
              style={{ width: 50, height: 30, resizeMode: 'contain', marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>Специальный</Text>
              {routePrice?.special && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ textDecorationLine: 'line-through', color: '#888', fontSize: 12 }}>
                    {routePrice?.special.full ?? '...'} ₽
                  </Text>
                  <Text style={{ color: '#256029', fontWeight: 'bold', fontSize: 14 }}>
                    {routePrice?.special.discounted ?? '...'} ₽
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {infoModalVisible && (
        <Modal transparent animationType="slide" onRequestClose={() => setInfoModalVisible(false)}>
          <View style={localStyles.modalContainer}>
            <View style={localStyles.modalContent}>
              <ScrollView>
                <Text style={localStyles.modalTitle}>
                  {infoTransportType === 'car' ? 'Легковой Автомобиль' : 'Специальный Автомобиль'}
                </Text>
                <Text style={localStyles.modalDescription}>
                  {infoTransportType === 'car'
                    ? 'Легковой автомобиль предназначен для стандартных поездок. Удобен для одного-двух пассажиров, без дополнительного оборудования.'
                    : 'Специальный автомобиль оборудован подъемником для инвалидных колясок, усиленной подвеской и дополнительным местом для сопровождающего.'}
                </Text>
              </ScrollView>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                style={localStyles.modalCloseButton}
              >
                <Text style={localStyles.modalCloseButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Блок стоимости поездки (отображается только если заданы оба адреса и есть данные по обоим тарифам) */}
      {from && to && routePrice?.standard && routePrice?.special && (
        <View style={{ marginVertical: 10, padding: 12, backgroundColor: '#F4F4F4', borderRadius: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>Стоимость поездки:</Text>
          <Text style={{ fontSize: 14, color: '#333' }}>
            🚗 Обычная:{' '}
            <Text style={{ textDecorationLine: 'line-through', color: '#999' }}>
              {routePrice.standard.full} ₽
            </Text>{' '}
            <Text style={{ color: '#256029', fontWeight: 'bold' }}>
              {routePrice.standard.discounted} ₽
            </Text>
          </Text>
          <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>
            ♿ Специальный:{' '}
            <Text style={{ textDecorationLine: 'line-through', color: '#999' }}>
              {routePrice.special.full} ₽
            </Text>{' '}
            <Text style={{ color: '#256029', fontWeight: 'bold' }}>
              {routePrice.special.discounted} ₽
            </Text>
          </Text>
        </View>
      )}

      {/* Кнопка «Далее» (появляется только если оба адреса заданы) */}
      {from && to && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(2)}
        >
          <Text style={styles.nextButtonText}>Далее</Text>
        </TouchableOpacity>
      )}

      {/* Модальное окно для поиска/выбора адреса */}
      <AddressSearchModal
        visible={!!searchTarget}
        onClose={() => setSearchTarget(null)}
        onSelect={handleSelect}
        initialQuery={searchTarget === 'from' ? from : to}
        target={searchTarget ?? undefined}
      />

      {/* Модальное окно для ввода номера подъезда */}
      <Modal
        visible={entranceModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEntranceModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={localStyles.modalOverlay}
        >
          <View style={localStyles.modalSheet}>
            <View style={localStyles.handle} />
            <Text style={localStyles.entranceTitle} accessibilityRole="header">
              Введите номер подъезда
            </Text>
            <TextInput
              ref={entranceRef}
              value={entranceInput}
              onChangeText={setEntranceInput}
              placeholder="Например, 3"
              style={localStyles.entranceInput}
              keyboardType="number-pad"
              accessible={true}
              accessibilityLabel="Поле ввода номера подъезда"
            />
            <TouchableOpacity
              onPress={() => {
                if (entranceTarget === 'from') setFromEntrance(entranceInput);
                else if (entranceTarget === 'to') setToEntrance(entranceInput);
                setEntranceModalVisible(false);
              }}
              style={localStyles.doneButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Готово"
            >
              <Text style={localStyles.doneButtonText}>Готово</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  inputLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 6,
  },
  addressField: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  addressText: {
    color: '#333',
  },
  entranceButton: {
    marginLeft: 8,
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  entranceButtonText: {
    fontSize: 14,
    color: '#333',
  },
  vehicleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  vehicleOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
    elevation: 3,
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#EAFBEA',
  },
  vehicleImage: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  vehicleText: {
    fontSize: 14,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Overlay behind the sheet
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  // Bottom sheet container
  modalSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  // Small handle bar at top of sheet
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  entranceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  entranceInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    fontSize: 16,
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  orderBanner: {
    backgroundColor: '#C8E6C9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  orderBannerRow: {
    flexDirection: 'column',
  },
  orderBannerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
    color: '#256029',
  },
  orderBannerText: {
    fontSize: 14,
    color: '#256029',
  },
});

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
  },
});