import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getCurrentUser } from '../lib/auth'; // предположим, что вы вынесли getCurrentUser в отдельный модуль api.js
import PreferencesModal from './PreferencesModal';

export default function UserProfileScreen() {
  const router = useRouter();

  // флаг показа модалки «Пожелания»
  const [modalVisible, setModalVisible] = useState(false);

  // предпочтения (оставляем как было, их можно тоже подгружать/сохранять на бэке)
  const [preferences, setPreferences] = useState({
    needsAssistance: false,
    hasWheelchair: false,
    guideDog: false,
    textOnly: false,
    canHear: false,
  });

  // стейт, где будем хранить данные пользователя, полученные с сервера
  const [userData, setUserData] = useState(null);

  // индикатор загрузки (чтобы показать, что идёт запрос)
  const [loading, setLoading] = useState(true);

  // при монтировании запросаем профиль
  useEffect(() => {
    let isMounted = true; // чтобы избежать обновления стейта после unmount

    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUserData(data);
        }
      } catch (error) {
        console.error('❌ Ошибка при получении данных профиля:', error);
        // можно установить какую-то флаг-ошибку, если нужно
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    // тут, скорее всего, нужно ещё слать запрос по логауту, чистить токен и т.п.
    router.replace('/login');
  };

  // пока идёт загрузка — показываем спиннер
  if (loading) {
    return (
      <View style={styles.loaderContainer} accessible={true}>
        <ActivityIndicator
          size="large"
          color="#000"
          accessibilityLabel="Загрузка данных профиля"
        />
      </View>
    );
  }

  // если по каким-то причинам userData не пришёл (null), можно вывести заглушку
  if (!userData) {
    return (
      <View style={styles.loaderContainer} accessible={true}>
        <Text
          style={styles.errorText}
          accessibilityRole="text"
          accessibilityLabel="Не удалось загрузить данные пользователя"
        >
          Не удалось загрузить данные пользователя
        </Text>
      </View>
    );
  }

  // разобрались: данные есть — отрисовываем UI
  return (
    <View style={styles.container}>
      {/* Кнопка назад */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Назад"
        accessibilityHint="Вернуться на предыдущий экран"
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        accessible={true}
        accessibilityLabel="Содержимое профиля"
      >
        {/* Аватар + Имя + Фамилия + Почта */}
        <View style={styles.header} accessible={true}>
          <Image
            source={
              userData.avatarUrl
                ? { uri: userData.avatarUrl }
                : require('../assets/images/6.png') // запасная иконка, если нет аватара
            }
            style={styles.avatar}
            accessibilityLabel="Аватар пользователя"
          />
          <View style={styles.nameContainer}>
            <Text
              style={styles.name}
              accessibilityRole="text"
              accessibilityLabel={`Имя и фамилия пользователя: ${userData.firstName} ${userData.lastName || ''}`}
            >
              {userData.firstName} {userData.lastName || ''}
            </Text>
            <Text
              style={styles.email}
              accessibilityRole="text"
              accessibilityLabel={`Электронная почта пользователя: ${userData.email ? userData.email : 'Не указана'}`}
            >
              {userData.email ? userData.email : 'Без почты'}
            </Text>
          </View>
        </View>

        {/* Телефон */}
        <View style={styles.fieldBlock} accessible={true}>
          <Text
            style={styles.fieldLabel}
            accessibilityRole="text"
            accessibilityLabel="Метка: Телефон"
          >
            Телефон
          </Text>
          <Text
            style={styles.fieldValue}
            accessibilityRole="text"
            accessibilityLabel={`Номер телефона: ${userData.phoneNumber ? userData.phoneNumber : 'Не указан'}`}
          >
            {userData.phoneNumber ? userData.phoneNumber : 'Не указан'}
          </Text>
        </View>

        {/* Имя (опционально, если нужно тоже отдельно) */}
        <View style={styles.fieldBlock} accessible={true}>
          <Text
            style={styles.fieldLabel}
            accessibilityRole="text"
            accessibilityLabel="Метка: Имя"
          >
            Имя
          </Text>
          <Text
            style={styles.fieldValue}
            accessibilityRole="text"
            accessibilityLabel={`Имя пользователя: ${userData.firstName}`}
          >
            {userData.firstName}
          </Text>
        </View>

        {/* Фамилия (если есть) */}
        {/* {userData.lastName && (
          <View style={styles.fieldBlock} accessible={true}>
            <Text
              style={styles.fieldLabel}
              accessibilityRole="text"
              accessibilityLabel="Метка: Фамилия"
            >
              Фамилия
            </Text>
            <Text
              style={styles.fieldValue}
              accessibilityRole="text"
              accessibilityLabel={`Фамилия пользователя: ${userData.lastName}`}
            >
              {userData.lastName}
            </Text>
          </View>
        )} */}

        {/* Указать пожелания */}
        <TouchableOpacity
          style={styles.preferenceButton}
          onPress={() => setModalVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Указать пожелания"
          accessibilityHint="Открыть диалог для выбора предпочтений"
        >
          <Text style={styles.preferenceText}>Указать пожелания</Text>
          <Feather name="chevron-right" size={22} color="green" />
        </TouchableOpacity>
      </ScrollView>

      {/* Кнопка выхода */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Выйти из профиля"
        accessibilityHint="Перейти на экран входа"
      >
        <Text style={styles.logoutText} accessibilityRole="text">
          Выйти из профиля
        </Text>
      </TouchableOpacity>

      <PreferencesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(newPrefs) => {
          setPreferences(newPrefs);
          console.log('Сохранили предпочтения:', newPrefs);
          // здесь можно отправить PATCH-запрос к API, чтобы сохранить prefs:
          // await api.patch('/users/me/preferences', newPrefs)
        }}
        initialValues={preferences}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  backButton: {
    padding: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  nameContainer: {
    flexShrink: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eee',
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  fieldBlock: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#999',
  },
  fieldValue: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  preferenceButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    paddingVertical: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});