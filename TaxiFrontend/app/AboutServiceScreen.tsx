import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AboutCard } from '../components/AboutCard';

const data = [
  {
    title: 'Что такое социальное такси?',
    text: 'Социальное такси — это сервис, предназначенный для перевозки маломобильных граждан. Заказ оформляется заранее через приложение или диспетчера.',
    icon: require('../assets/images/taxiicon.png'),
  },
  {
    title: 'Кто может пользоваться сервисом?',
    text: 'Сервисом могут пользоваться инвалиды, пожилые люди, а также сопровождающие их лица. Возможны поездки в учреждения, больницы, социальные центры.',
    icon: require('../assets/images/people.png'),
  },
  {
    title: 'Чем отличается от обычного такси?',
    text: 'Водители проходят спецобучение, машины оборудованы подъёмниками, пандусами или фиксирующими устройствами. Ожидание и сопровождение входит в стоимость.',
    icon: require('../assets/images/lifttaxi.png'),
  },
  {
    title: 'Сколько стоит поездка?',
    text: 'Стоимость зависит от города и маршрута, часть расходов может компенсироваться государством. Точная цена отображается при оформлении заказа.',
    icon: require('../assets/images/money.png'),
  },
  {
    title: 'Какие документы нужны?',
    text: 'При себе необходимо иметь паспорт и документ, подтверждающий льготу (например, справка МСЭ или пенсионное удостоверение).',
    icon: require('../assets/images/documents.png'),
  },
];

export default function AboutServiceScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubbles-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <AboutCard
            title={item.title}
            icon={item.icon}
            onPress={() => setSelected(item)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={<Text style={styles.heading}>О сервисе</Text>}
      />

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            <Text style={styles.modalText}>{selected?.text}</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
              <Text style={{ color: '#007AFF' }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
  },
  modalClose: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
});