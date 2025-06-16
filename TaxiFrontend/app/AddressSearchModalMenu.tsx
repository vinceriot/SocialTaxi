// AddressSearchModalMenu.tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { fetchUserAddresses } from '../lib/api'; // Убедитесь, что этот импорт правильный
import { useOrderStore } from './stores/orderStore';

type SavedAddress = {
  id: string;
  label: string;
  address: {
    id: string;
    latitude: string;
    longitude: string;
    country?: string;
    region?: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
    entrance?: string;
    postalCode?: string;
    fullAddress: string;
  };
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: {
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
  }) => void;
  target?: 'from' | 'to';
};

export default function AddressSearchModal({
  visible,
  onClose,
  onSelect,
  target,
}: Props) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [savedAddressesList, setSavedAddressesList] = useState<SavedAddress[]>([]);
  const [savedLoading, setSavedLoading] = useState<boolean>(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const router = useRouter();
  const { setFromEntrance, setToEntrance } = useOrderStore();

  // 1. Загружаем сохранённые адреса при переключении на вкладку «saved»
  useEffect(() => {
    if (activeTab !== 'saved') return;

    const loadSaved = async () => {
      setSavedLoading(true);
      setSavedError(null);
      try {
        const data: SavedAddress[] = await fetchUserAddresses();
        setSavedAddressesList(data);
      } catch (error) {
        console.error('Ошибка при загрузке сохранённых адресов', error);
        setSavedError('Не удалось загрузить адреса');
      } finally {
        setSavedLoading(false);
      }
    };

    loadSaved();
  }, [activeTab]);

  // 2. Поиск по OSM — выполняем при изменении query (с дебаунсом 500 мс)
  useEffect(() => {
    const fetchData = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      let processedQuery = query.trim();
      if (processedQuery.toLowerCase().startsWith('улица ')) {
        processedQuery = processedQuery.substring(6).trim();
      }
      const searchString = `улица ${processedQuery}`;

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchString
          )}&addressdetails=1&countrycodes=ru&viewbox=51.0,62.0,60.5,55.5&bounded=1`,
          {
            headers: {
              'User-Agent': 'SocialTaxiApp/1.0 (ptaha.re@gmail.com)',
            },
          }
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // 3. Форматируем ответ OSM в строку типа "улица Лермонтова, 12"
  const formatAddress = (item: any) => {
    const addr = item.address || item;
    const parts = [
      addr.road || addr.pedestrian || addr.footway || addr.street,
      addr.house_number || addr.house,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // 4. Рендер одного элемента из savedAddressesList
  const renderSavedItem = ({ item }: { item: SavedAddress }) => {
    // Составляем структуру, которую ожидает onSelect в Step1FromTo
    const details = {
      latitude: item.address.latitude,
      longitude: item.address.longitude,
      country: item.address.country || '',
      region: item.address.region || '',
      city: item.address.city,
      street: item.address.street,
      house: item.address.house,
      apartment: item.address.apartment || '',
      entrance: item.address.entrance || '',
      postalCode: item.address.postalCode || '',
      fullAddress: item.address.fullAddress,
    };

    return (
      <TouchableOpacity
        style={[styles.item, isDarkMode && styles.itemDark]}
        onPress={() => {
          if (target === 'from') setFromEntrance(details.entrance);
          else if (target === 'to') setToEntrance(details.entrance);
          onSelect(details);
          onClose();
        }}
        accessibilityRole="button"
        accessibilityLabel={`${item.label}, ${item.address.fullAddress}`}
      >
        <Text style={[styles.itemLabel, isDarkMode && styles.itemLabelDark]}>
          {item.label}
        </Text>
        <Text style={[styles.itemAddress, isDarkMode && styles.itemAddressDark]}>
          {item.address.street}, {item.address.house}
        </Text>
        <Text style={[styles.itemCity, isDarkMode && styles.itemCityDark]}>
          {item.address.city}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.innerContainer, isDarkMode && styles.innerContainerDark]}>
          {/* Вкладки «Поиск» / «Сохранённые» */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'search' && styles.activeTab,
                activeTab === 'search' && isDarkMode && styles.activeTabDark,
              ]}
              onPress={() => setActiveTab('search')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'search' && styles.activeTabText,
                  isDarkMode && styles.tabTextDark,
                  activeTab === 'search' && isDarkMode && styles.activeTabTextDark,
                ]}
              >
                Поиск
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'saved' && styles.activeTab,
                activeTab === 'saved' && isDarkMode && styles.activeTabDark,
              ]}
              onPress={() => setActiveTab('saved')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'saved' && styles.activeTabText,
                  isDarkMode && styles.tabTextDark,
                  activeTab === 'saved' && isDarkMode && styles.activeTabTextDark,
                ]}
              >
                Сохранённые
              </Text>
            </TouchableOpacity>
          </View>

          {/* Вкладка «Поиск» */}
          {activeTab === 'search' && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Введите адрес"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                />
                {isLoading && (
                  <ActivityIndicator
                    style={styles.loadingIndicator}
                    color={isDarkMode ? '#aaa' : '#888'}
                  />
                )}
              </View>

              <FlatList
                data={results}
                keyExtractor={(item) => item.place_id.toString()}
                renderItem={({ item }) => {
                  const selected = {
                    latitude: item.lat,
                    longitude: item.lon,
                    country: item.address.country || '',
                    region: item.address.state || '',
                    city: item.address.city || item.address.town || item.address.village || '',
                    street: item.address.road || item.address.street || '',
                    house: item.address.house_number || '',
                    apartment: item.address.apartment || '',
                    entrance: item.address.entrance || '',
                    postalCode: item.address.postcode || '',
                    fullAddress: formatAddress(item),
                  };

                  return (
                    <TouchableOpacity
                      style={[styles.item, isDarkMode && styles.itemDark]}
                      onPress={() => {
                        if (target === 'from') setFromEntrance(selected.entrance);
                        else if (target === 'to') setToEntrance(selected.entrance);
                        onSelect(selected);
                        onClose();
                      }}
                    >
                      <Text style={[styles.itemLabel, isDarkMode && styles.itemLabelDark]}>
                        {formatAddress(item)}
                      </Text>
                      <Text style={[styles.itemCity, isDarkMode && styles.itemCityDark]}>
                        {selected.city}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={() => (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="location-outline"
                      size={48}
                      color={isDarkMode ? '#444' : '#ccc'}
                    />
                    <Text
                      style={[
                        styles.emptyStateText,
                        isDarkMode && styles.emptyStateTextDark,
                      ]}
                    >
                      {query.length >= 3 ? 'Адресов не найдено' : 'Начните вводить адрес'}
                    </Text>
                  </View>
                )}
              />
            </>
          )}

          {/* Вкладка «Сохранённые» */}
          {activeTab === 'saved' && (
            <>
              {savedLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={isDarkMode ? '#aaa' : '#888'} />
                  <Text
                    style={[
                      styles.emptyStateText,
                      isDarkMode && styles.emptyStateTextDark,
                      { marginTop: 16 },
                    ]}
                  >
                    Загрузка сохранённых адресов...
                  </Text>
                </View>
              ) : savedError ? (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, isDarkMode && styles.emptyStateTextDark]}>
                    {savedError}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={savedAddressesList}
                  keyExtractor={(item) => item.id}
                  renderItem={renderSavedItem}
                  ListHeaderComponent={() => (
                    <Text style={[styles.sectionHeader, isDarkMode && styles.sectionHeaderDark]}>
                      Сохранённые адреса ({savedAddressesList.length})
                    </Text>
                  )}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="location-outline"
                        size={48}
                        color={isDarkMode ? '#444' : '#ccc'}
                      />
                      <Text
                        style={[
                          styles.emptyStateText,
                          isDarkMode && styles.emptyStateTextDark,
                        ]}
                      >
                        Нет сохранённых адресов
                      </Text>
                    </View>
                  )}
                />
              )}
            </>
          )}

          {/* Кнопка «Указать на карте» */}
          <TouchableOpacity
            style={[styles.mapButton, isDarkMode && styles.mapButtonDark]}
            onPress={() => {
              router.push({
                pathname: '/SelectLocationScreen',
                params: { target },
              });
            }}
          >
            <MaterialIcons
              name="map"
              size={24}
              color={isDarkMode ? '#64b5f6' : '#1976d2'}
            />
            <Text style={[styles.mapButtonText, isDarkMode && styles.mapButtonTextDark]}>
              Указать на карте
            </Text>
          </TouchableOpacity>

          {/* Кнопка «Отмена» */}
          <TouchableOpacity
            style={[styles.cancelButton, isDarkMode && styles.cancelButtonDark]}
            onPress={onClose}
          >
            <Text style={[styles.cancelButtonText, isDarkMode && styles.cancelButtonTextDark]}>
              Отмена
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  innerContainerDark: {
    backgroundColor: '#121212',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1a73e8',
  },
  activeTabDark: {
    backgroundColor: '#0d47a1',
  },
  tabText: {
    color: '#333',
    fontWeight: '600',
  },
  tabTextDark: {
    color: '#f0f0f0',
  },
  activeTabText: {
    color: 'white',
  },
  activeTabTextDark: {
    color: 'white',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    color: '#333',
    fontSize: 16,
  },
  inputDark: {
    borderColor: '#333',
    backgroundColor: '#1e1e1e',
    color: '#f0f0f0',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  item: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  itemDark: {
    backgroundColor: '#1e1e1e',
  },
  itemLabel: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemLabelDark: {
    color: '#f0f0f0',
  },
  itemAddress: {
    color: '#666',
    fontSize: 14,
  },
  itemAddressDark: {
    color: '#aaa',
  },
  itemCity: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  itemCityDark: {
    color: '#888',
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeaderDark: {
    backgroundColor: '#1e1e1e',
    color: '#aaa',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateTextDark: {
    color: '#aaa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginVertical: 12,
  },
  mapButtonDark: {
    backgroundColor: '#0d47a1',
  },
  mapButtonText: {
    color: '#1976d2',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  mapButtonTextDark: {
    color: '#64b5f6',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  cancelButtonDark: {
    backgroundColor: '#1e1e1e',
  },
  cancelButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonTextDark: {
    color: '#ff6b6b',
  },
});