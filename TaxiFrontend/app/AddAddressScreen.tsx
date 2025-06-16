import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteUserAddress, fetchUserAddressById, saveUserAddress, updateUserAddress } from '../lib/api'; // проверь, что функция экспортируется корректно
import { useAddressStore } from './stores/addressStore';



export default function AddAddressScreen() {
  const router = useRouter();
  const route = useLocalSearchParams();
  const mode = route.mode || 'create'; // 'create' или 'edit'
  const addressId = route.id;
  const { selectedAddress, clearAddress } = useAddressStore();
  const [form, setForm] = useState({
    label: '',
    entrance: '',
    flat: '',
    floor: '',
    intercom: '',
    comment: '',
  });
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };



const handleSave = async () => {
  console.log('selectedAddress:', selectedAddress);
  if (!selectedAddress) {
    console.warn('Адрес не выбран');
    return;
  }

  if (!form.label) {
    console.warn('Укажите название адреса');
    return;
  }

  const addressDto = {
    fullAddress: selectedAddress.displayName,
    latitude: +selectedAddress.latitude,
    longitude: +selectedAddress.longitude,
    country: selectedAddress.country || '',
    region: selectedAddress.state || '',
    city: selectedAddress.city || selectedAddress.town || '',
    street: selectedAddress.road || '',
    house: selectedAddress.house_number || '',
    apartment: form.flat,
    postalCode: selectedAddress.postcode || '',
    entrance: form.entrance,
  };

  const payload = {
    label: form.label,
    address: addressDto,
  };

  console.log('payload:', payload);

  try {
    let response;
    if (mode === 'edit' && typeof addressId === 'string') {
      response = await updateUserAddress(addressId, payload);
    } else {
      response = await saveUserAddress(payload);
    }

    console.log('Адрес успешно сохранён/обновлён', response);
    clearAddress();
    router.back();
  } catch (err: any) {
    if (err.response) {
      console.error('Ошибка от сервера:', err.response.status, err.response.data);
    } else if (err.request) {
      console.error('Нет ответа от сервера. Запрос:', err.request);
    } else {
      console.error('Ошибка при настройке запроса:', err.message);
    }
  }
};

  useEffect(() => {
    if (mode === 'edit' && typeof addressId === 'string') {
      const loadExistingAddress = async () => {
        try {
          const data = await fetchUserAddressById(addressId);
          const a = data.address;
          setForm({
            label: data.label || '',
            entrance: a.entrance || '',
            flat: a.apartment || '',
            floor: '',
            intercom: '',
            comment: '',
          });
          useAddressStore.getState().setSelectedAddress({
            displayName: a.fullAddress,
            latitude: a.latitude,
            longitude: a.longitude,
            country: a.country,
            state: a.region,
            city: a.city,
            road: a.street,
            house_number: a.house,
            postcode: a.postalCode,
          });
        } catch (e) {
          console.error('Ошибка при загрузке адреса:', e);
        }
      };
      loadExistingAddress();
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUserAddress(id);
      console.log('Адрес успешно удалён');
      router.back();
    } catch (err) {
      console.error('Ошибка при удалении адреса:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={isTablet ? 32 : 28} />
          </TouchableOpacity>
          {mode === 'edit' && (
            <TouchableOpacity onPress={() => handleDelete(addressId)}>
              <Ionicons name="trash" size={isTablet ? 28 : 24} color="red" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>Адрес для такси</Text>
        <Text style={styles.subtitle}>Сохраните места, которые вы часто посещаете</Text>

        <Text style={styles.label}>Название</Text>
        <TextInput style={styles.input} value={form.label} onChangeText={v => handleChange('label', v)} />

        <Text style={styles.label}>Адрес</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => router.push('/AddressSearchModal')}
        >
          <Text style={{ color: '#666' }}>{selectedAddress?.displayName || 'Выберите на карте'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Подъезд</Text>
        <TextInput style={styles.input} value={form.entrance} onChangeText={v => handleChange('entrance', v)} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Квартира</Text>
            <TextInput style={styles.input} value={form.flat} onChangeText={v => handleChange('flat', v)} />
          </View>
          <View style={{ width: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Этаж</Text>
            <TextInput style={styles.input} value={form.floor} onChangeText={v => handleChange('floor', v)} />
          </View>
        </View>

        <Text style={styles.label}>Домофон</Text>
        <TextInput style={styles.input} value={form.intercom} onChangeText={v => handleChange('intercom', v)} />

        <Text style={styles.label}>Комментарий к адресу</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={form.comment}
          onChangeText={v => handleChange('comment', v)}
        />
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Сохранить адрес</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 12,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});