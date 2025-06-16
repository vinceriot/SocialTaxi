import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';

export default function MapSelectScreen({ onSelect }: { onSelect: (result: { coords: any, address: string }) => void }) {
  const [coords, setCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const pos = { latitude, longitude };
      setCoords(pos);
      fetchAddressFromCoords(latitude, longitude);
    })();
  }, []);

  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const json = await res.json();
      setAddress(json.display_name || 'Не удалось получить адрес');
    } catch {
      setAddress('Ошибка при получении адреса');
    }
  };

  const handleDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoords({ latitude, longitude });
    fetchAddressFromCoords(latitude, longitude);
  };

  if (!coords) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        <Marker
          draggable
          coordinate={coords}
          onDragEnd={handleDragEnd}
        />
      </MapView>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.address}>{address}</Text>
        <Button mode="contained" onPress={() => onSelect({ coords, address })}>
          Выбрать этот адрес
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  address: {
    fontSize: 14,
    marginBottom: 10,
  },
});