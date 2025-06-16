// components/AddressSearchModal.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAddressStore } from './stores/addressStore';

export default function AddressSearchModal({ visible, onClose, onSelect }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ place_id: string; display_name: string; lat: string; lon: string; address: any }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length < 3) return;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`,
        { headers: { 'User-Agent': 'SocialTaxiApp/1.0 (ptaha.re@gmail.com)' } }
      );
      const data = await res.json();
      setResults(data);
    };

    const timer = setTimeout(fetchData, 300); // debounce
    return () => clearTimeout(timer);
  }, [query]);

  const formatAddress = (item: any) => {
    const addr = item.address;
    const parts = [
      addr.road || addr.pedestrian || addr.footway || addr.street,
      addr.house_number,
      addr.city || addr.town || addr.village
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Введите адрес"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <FlatList
            data={results}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    useAddressStore.getState().setSelectedAddress({
                        displayName: item.display_name,
                        latitude: parseFloat(item.lat),
                        longitude: parseFloat(item.lon),
                        ...item.address,
                    });
                    router.back();
                    }}
              >
                <Text>{formatAddress(item)}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.cancel}>
            <Text style={{ color: 'red', fontSize: 16 }}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cancel: {
    marginTop: 12,
    alignItems: 'center',
  },
});
