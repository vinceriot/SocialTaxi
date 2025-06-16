import { fetchUserAddresses } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useFocusEffect(
    useCallback(() => {
      const loadAddresses = async () => {
        try {
          const data = await fetchUserAddresses();
          setAddresses(data);
        } catch (error) {
          console.error('Ошибка при загрузке адресов', error);
        }
      };
      loadAddresses();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => router.push({ pathname: '/AddAddressScreen', params: { id: item.id, mode: 'edit' } })}
    >
      <View>
        <Text style={styles.addressText}>{item.address.street}, {item.address.house}</Text>
        <Text style={styles.addressType}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => { /* TODO: navigation.goBack() */ }}>
          <Ionicons name="arrow-back" size={isTablet ? 32 : 28} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Мои адреса</Text>
        <TouchableOpacity onPress={() => router.push('/AddAddressScreen')}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Нет сохранённых адресов</Text>}
        style={{ marginBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backArrow: {
    fontSize: 24,
  },
  addIcon: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#000',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
  },
  addressType: {
    fontSize: 13,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
