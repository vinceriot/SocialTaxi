// MainScreen.tsx
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import MenuModal from '../../components/MenuModal';
import { createOrder } from '../../lib/api';

import Step1FromTo from '../Step1FromTo';
import Step2Preferences from '../Step2Preferences';
import Step3Confirmation from '../Step3Confirmation';
import Step4OrderCreated from '../Step4OrderCreated';
import StepPurpose from '../StepPurpose';

import { useOrderStore } from '../stores/orderStore'; // путь к вашему store.ts

export default function MainScreen() {
  // Получаем все нужные состояния и методы из стора
  const {
    step,
    setStep,
    orderId,
    setOrderId,

    from,
    setFrom,
    to,
    setTo,

    vehicleType,
    setVehicleType,

    fromCoord,
    setFromCoord,
    toCoord,
    setToCoord,

    selectingPoint,
    setSelectingPoint,

    guideDog,
    setGuideDog,
    textOnly,
    setTextOnly,
    canHear,
    setCanHear,
    needsAssistance,
    setNeedsAssistance,
    hasWheelchair,
    setHasWheelchair,
    comment,
    setComment,

    date,
    setDate,
    time,
    setTime,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,

    fromAddressDetails,
    setFromAddressDetails,
    toAddressDetails,
    setToAddressDetails,

    goal,
    returnPickupTime,
    showReturnPickupPicker,
    needReturnPickup,
    setReturnPickupTime,
    setShowReturnPickupPicker,
    setNeedReturnPickup,
    setGoal,

    menuVisible,
    setMenuVisible,
  } = useOrderStore();

  // Запрос разрешения на геолокацию (остается без изменений)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Нет доступа к геолокации');
      }
    })();
  }, []);

  // Навигационные параметры (выбор адреса на другом экране)
  const { selectedLat, selectedLon, selectedAddress, target } = useLocalSearchParams();

  useEffect(() => {
    if (selectedLat && selectedLon && selectedAddress && target) {
      const addressDetails = {
        latitude: parseFloat(String(selectedLat)),
        longitude: parseFloat(String(selectedLon)),
        fullAddress: String(selectedAddress),
      };

      if (target === 'from') {
        setFrom(addressDetails.fullAddress);
        setFromCoord({ latitude: addressDetails.latitude, longitude: addressDetails.longitude });
        setFromAddressDetails(addressDetails);
      } else if (target === 'to') {
        setTo(addressDetails.fullAddress);
        setToCoord({ latitude: addressDetails.latitude, longitude: addressDetails.longitude });
        setToAddressDetails(addressDetails);
      }
    }
  }, [selectedLat, selectedLon, selectedAddress, target]);

  // Функция геокодирования (остается без изменений, но теперь чтобы сохранить результат — используем экшены из стора)
  const reverseGeocode = async (coord: LatLng): Promise<any> => {
    try {
      const results = await Location.reverseGeocodeAsync(coord);
      if (results.length > 0) {
        const result = results[0];
        const { street, name, city } = result;
        return {
          ...result,
          latitude: coord.latitude,
          longitude: coord.longitude,
          fullAddress: `${street ?? ''} ${name ?? ''}, ${city ?? ''}`,
        };
      }
    } catch (error) {
      console.error('Ошибка геокодирования:', error);
      alert('Ошибка при геокодировании');
    }
    return { fullAddress: 'Неизвестный адрес', latitude: coord.latitude, longitude: coord.longitude };
  };

  // Отправка заказа на сервер (заменили local state → store)
  const handleSubmitOrder = async () => {
    try {
      const purposeMap: Record<string, number> = {
        'Медицинская организация': 1,
        'Аэропорт, автовокзалы, железнодорожные вокзалы': 2,
        'Место осуществления трудовой деятельности': 3,
        'Фонд социального страхования Российской Федерации': 4,
        'Пенсионный фонд Российской Федерации': 5,
        'Спортивно-оздоровительная организация': 6,
      };
      const purposeId = purposeMap[goal];
      if (!purposeId) {
        Alert.alert('Ошибка', 'Цель поездки не определена');
        return;
      }

      const preferenceIds: number[] = [
        ...(guideDog ? [1] : []),
        ...(textOnly ? [2] : []),
        ...(canHear ? [3] : []),
        ...(needsAssistance ? [4] : []),
        ...(hasWheelchair ? [5] : []),
      ];

      const segments: any[] = [
        {
          fromAddress: fromAddressDetails,
          toAddress: toAddressDetails,
          departureTime: `${date}T${time}:00`,
        },
      ];

      if (needReturnPickup && returnPickupTime) {
        segments.push({
          fromAddress: toAddressDetails,
          toAddress: fromAddressDetails,
          departureTime: `${date}T${returnPickupTime}:00`,
        });
      }

      const { id } = await createOrder({
        vehicleType,
        purposeId,
        comment,
        preferenceIds,
        segments,
      });

      setOrderId(id);
      setStep(5);
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      Alert.alert('Ошибка', 'Не удалось отправить заказ');
    }
  };

  return (
    <View style={styles.container}>
      {/* Карта */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 58.0105,
          longitude: 56.2502,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={async (e) => {
          if (!selectingPoint) return;
          const coord = e.nativeEvent.coordinate;
          const address = await reverseGeocode(coord);

          if (selectingPoint === 'from') {
            setFromCoord(coord);
            setFrom(address.fullAddress);
            setFromAddressDetails(address);
          } else {
            setToCoord(coord);
            setTo(address.fullAddress);
            setToAddressDetails(address);
          }
          setSelectingPoint(null);
        }}
      >
        {fromCoord && <Marker coordinate={fromCoord} title="Откуда" />}
        {toCoord && <Marker coordinate={toCoord} title="Куда" />}
      </MapView>

      {/* Кнопка меню */}
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Text style={{ fontSize: 24 }}>☰</Text>
      </TouchableOpacity>

      <MenuModal visible={menuVisible} setVisible={setMenuVisible} styles={styles} />

      {/* Шаги (теперь без пропсов, все из стора) */}
      {step === 1 && <Step1FromTo styles={styles} />}
      {step === 2 && <Step2Preferences styles={styles} />}
      {step === 3 && <Step3Confirmation styles={styles} />}
      {step === 4 && (
        <StepPurpose
          styles={styles}
          onBack={() => setStep(3)}
          onNext={handleSubmitOrder}
        />
      )}
      {step === 5 && orderId && (
        <Step4OrderCreated
          orderId={orderId}
          onClose={() => setStep(1)}
          onCancelOrder={() => alert('Отмена заказа')}
          onContactDispatcher={() => alert('Связь с диспетчером')}
          onContactDriver={() => alert('Связь с водителем')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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
  input: { marginBottom: 12, backgroundColor: 'white' },
  vehicleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vehicleOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#c8e6c9',
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkboxLabel: { fontSize: 16 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContent: {
    width: 250,
    backgroundColor: 'white',
    padding: 24,
    paddingTop: 50,
    height: '100%',
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
  },
  fullscreenMenu: {
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  menuItem: {
    fontSize: 16,
    color: 'purple',
    marginBottom: 20,
  },
  dateTimeInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
});