import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCurrentUser } from '../lib/auth';

interface MenuModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function MenuModal({ visible, setVisible }: MenuModalProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentUser();
        setProfile(data);
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
    loadProfile();
  }, []);

  const showComingSoon = () => {
    alert('Функция скоро будет доступна');
    setVisible(false);
  };

  const menuItems = [
    {
      title: "Бронирования",
      icon: <MaterialCommunityIcons name="calendar-clock" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => {
        setVisible(false);
        router.push('/MyReservationScreen');
      }
    },
    {
      title: "История поездок",
      icon: <Ionicons name="time" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => {
        setVisible(false);
        router.push('/MyOrdersScreen');
      }
    },
    {
      title: "Профиль",
      icon: <Ionicons name="person" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => {
        setVisible(false);
        router.push('/profile');
      }
    },
    /* {
      title: "Платежи",
      icon: <MaterialIcons name="payment" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => showComingSoon()
    }, */
    {
      title: "Избранные адреса",
      icon: <FontAwesome5 name="heart" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => {
        setVisible(false);
        router.push('/SavedAddressesScreen');
      }
    },
    {
      title: "Служба поддержки",
      icon: <Ionicons name="help-circle" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => {
        setVisible(false);
        router.push({
          pathname: '/AllChatsSupport',
        });
      }
    },
    {
      title: "О сервисе",
      icon: <Feather name="settings" size={isTablet ? 28 : 24} color="#4CAF50" />,
      action: () => {
        setVisible(false);
        router.push('/AboutServiceScreen');
      }
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Шапка меню */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setVisible(false)}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={isTablet ? 32 : 28} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <View style={[styles.avatar, isTablet && styles.avatarTablet]}>
              <Ionicons name="person" size={isTablet ? 40 : 32} color="#fff" />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, isTablet && styles.userNameTablet]}>
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Загрузка...'}
              </Text>
              <Text style={[styles.userPhone, isTablet && styles.userPhoneTablet]}>
                {profile ? profile.email : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Основное меню */}
        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={item.action}
              activeOpacity={0.7}
              style={[styles.menuItem, isTablet && styles.menuItemTablet]}
            >
              <View style={styles.iconContainer}>
                {item.icon}
              </View>
              <Text style={[styles.menuItemText, isTablet && styles.menuItemTextTablet]}>
                {item.title}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={isTablet ? 24 : 20} 
                color="#BDBDBD" 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: isTablet ? 40 : 20,
  },
  header: {
    paddingVertical: isTablet ? 30 : 20,
  },
  backButton: {
    padding: 5,
    alignSelf: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isTablet ? 40 : 30,
    marginBottom: isTablet ? 50 : 40,
  },
  avatar: {
    width: isTablet ? 80 : 60,
    height: isTablet ? 80 : 60,
    borderRadius: isTablet ? 40 : 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 25 : 15,
  },
  avatarTablet: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userNameTablet: {
    fontSize: 22,
  },
  userPhone: {
    fontSize: 15,
    color: '#757575',
    marginTop: 4,
  },
  userPhoneTablet: {
    fontSize: 18,
  },
  menuItems: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 22 : 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  menuItemTablet: {
    paddingVertical: 26,
  },
  iconContainer: {
    width: isTablet ? 50 : 40,
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  menuItemTextTablet: {
    fontSize: 20,
  },
});