// SelectLocationScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrderStore } from './stores/orderStore'; // путь к вашему store.ts

export default function SelectLocationScreen() {
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [region, setRegion] = useState({
    latitude: 58.0105,
    longitude: 56.2502,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [markerCoord, setMarkerCoord] = useState<LatLng | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const router = useRouter();
  const { target } = useLocalSearchParams<{ target: 'from' | 'to' }>(); // получаем, куда записывать

  // Берём сеттеры из стора для from/to
  const {
    setFrom,
    setFromCoord,
    setFromAddressDetails,
    setTo,
    setToCoord,
    setToAddressDetails,
  } = useOrderStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        const loc = await Location.getLastKnownPositionAsync();
        if (loc) {
          setRegion((prev) => ({
            ...prev,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }));
        }
      } else {
        Alert.alert(
          'Нет доступа',
          'Для работы с картой требуется доступ к геолокации'
        );
      }
    })();
  }, []);

  const handleMapPress = async (e: { nativeEvent: { coordinate: LatLng } }) => {
    const coord = e.nativeEvent.coordinate;
    setMarkerCoord(coord);
    setLoadingAddress(true);

    try {
      const [res] = await Location.reverseGeocodeAsync(coord);
      const { street, name, city, country, region: reg, postalCode } = res;
      const fullAddress =
        `${street ?? ''} ${name ?? ''}`.trim() + (city ? `, ${city}` : '');
      setAddress(fullAddress || 'Неизвестный адрес');

      // Сохраняем детали для отсылки в стор
      setLoadingAddress(false);
    } catch (err) {
      console.error(err);
      setAddress('Не удалось определить адрес');
      setLoadingAddress(false);
    }
  };

  const handleConfirm = () => {
    if (!markerCoord) {
      Alert.alert('Выберите точку', 'Нажмите на карту, чтобы поставить метку');
      return;
    }
    // Собираем addressDetails
    const [lat, lon] = [markerCoord.latitude.toString(), markerCoord.longitude.toString()];
    const addressDetails = {
      latitude: lat,
      longitude: lon,
      country: '', // OSM не дала country в reverseGeocode, можно оставить ''
      region: '',
      city: address.split(', ')[1] || '',
      street: address.split(', ')[0].split(' ')[0] || '',
      house: address.split(', ')[0].split(' ')[1] || '',
      apartment: '',
      entrance: '',
      postalCode: '',
      fullAddress: address,
    };

    if (target === 'from') {
      setFrom(address);
      setFromCoord(markerCoord);
      setFromAddressDetails(addressDetails);
    } else if (target === 'to') {
      setTo(address);
      setToCoord(markerCoord);
      setToAddressDetails(addressDetails);
    }
    router.back();
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 100);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goToMyLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const coord = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setRegion((prev) => ({
        ...prev,
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));
      setMarkerCoord(coord);
      setLoadingAddress(true);
      try {
        const [res] = await Location.reverseGeocodeAsync(coord);
        const { street, name, city } = res;
        const full = `${street ?? ''} ${name ?? ''}`.trim() + (city ? `, ${city}` : '');
        setAddress(full || 'Неизвестный адрес');
      } catch (err) {
        console.error(err);
        setAddress('Не удалось определить адрес');
      } finally {
        setLoadingAddress(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось получить текущее местоположение');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Хедер с кнопкой назад */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Выбор местоположения</Text>
      </View>

      <MapView style={styles.map} region={region} onPress={handleMapPress}>
        {markerCoord && (
          <Marker coordinate={markerCoord}>
            <View style={styles.marker}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Кнопка «Моё местоположение» */}
      <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
        <Ionicons name="locate" size={20} color="#4CAF50" />
      </TouchableOpacity>

      {/* Нижняя панель */}
      <View style={[styles.panel, { paddingBottom: insets.bottom + 16 }]}>
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.panelContent}>
            <Text style={styles.panelTitle}>Выбранное местоположение</Text>

            {loadingAddress ? (
              <ActivityIndicator size="small" color="#4CAF50" style={styles.loader} />
            ) : markerCoord ? (
              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>Адрес:</Text>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>
                Нажмите на карту, чтобы выбрать точку
              </Text>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, !markerCoord && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={!markerCoord}
              >
                <Text style={styles.confirmText}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {showScrollTop && (
          <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
            <Ionicons name="chevron-up" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  myLocationButton: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  panelContent: {
    padding: 24,
    paddingBottom: 8,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  addressContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addressLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    marginLeft: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loader: {
    marginVertical: 16,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});