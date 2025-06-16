// app/SupportChatsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  createUserSupportChat,
  fetchUserSupportChats,
  SupportConversation,
} from '../lib/chat';

import { getCurrentUserId } from '../lib/getCurrentUserId';

export default function SupportChatsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [chats, setChats] = useState<SupportConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
  try {
    const data = await fetchUserSupportChats();
    const sorted = data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setChats(sorted);
  } catch (error) {
    console.error('Ошибка при загрузке чатов поддержки', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    loadChats();
  };

  const handleCreateChat = async () => {
    setCreating(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.warn(
          'Не удалось получить userId. Возможно, пользователь не авторизован.'
        );
        setCreating(false);
        return;
      }

      const newConversationId = await createUserSupportChat();

      router.push({
        pathname: '/ChatScreen',
        params: {
          conversationId: newConversationId,
          title: 'Новое обращение',
          currentUserId: userId,
        },
      });
    } catch (error) {
      console.error('Ошибка при создании обращения', error);
    } finally {
      setCreating(false);
    }
  };

  const renderItem = ({ item }: { item: SupportConversation }) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const lastUpdated = new Date(item.updatedAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isClosed = item.status === 'closed';
    const statusText = isClosed
      ? 'Завершено'
      : Array.isArray(item.participants) && item.participants.length > 0
      ? item.participants.some((p) => p.role === 'support')
        ? 'Ожидает ответа поддержки'
        : 'Ожидает вашего ответа'
      : 'Новое обращение';

    return (
      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Обращение от ${formattedDate}. Статус: ${statusText}. ${
          isClosed ? 'Чат закрыт.' : 'Нажмите, чтобы открыть чат.'
        }`}
        style={[
          styles.chatCard,
          {
            backgroundColor: colors.card,
            opacity: isClosed ? 0.5 : 1,
          },
        ]}
        onPress={() => {
          if (!isClosed) {
            router.push({
              pathname: '/ChatScreen',
              params: {
                conversationId: item.id,
                title: `Обращение от ${formattedDate}`,
              },
            });
          }
        }}
        disabled={isClosed}
      >
        <View style={styles.chatContent}>
          <Text
            accessibilityRole="header"
            style={[
              styles.chatTitle,
              { color: isClosed ? `${colors.text}80` : colors.text },
            ]}
          >
            {`Обращение от ${formattedDate}`}
          </Text>

          <View style={styles.chatStatus}>
            <View
              accessibilityRole="text"
              accessibilityLabel={`Индикатор статуса: ${statusText}`}
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: isClosed
                    ? '#9CA3AF'
                    : statusText.includes('поддержки')
                    ? '#F59E0B'
                    : statusText.includes('вашего')
                    ? '#10B981'
                    : '#3B82F6',
                },
              ]}
            />
            <Text
              accessibilityRole="text"
              style={[
                styles.chatPreview,
                { color: isClosed ? `${colors.text}80` : colors.text },
              ]}
            >
              {statusText}
            </Text>
          </View>

          <Text
            accessibilityRole="text"
            style={[
              styles.chatDate,
              { color: isClosed ? `${colors.text}80` : colors.text },
            ]}
          >
            Обновлено: {lastUpdated}
          </Text>
        </View>

        <Ionicons
          accessible={false}
          name="chevron-forward"
          size={20}
          color={isClosed ? `${colors.text}80` : colors.text}
          style={{ opacity: isClosed ? 0 : 0.5 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      accessible={true}
      accessibilityLabel="Экран службы поддержки"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text accessibilityRole="header" style={[styles.header, { color: colors.text }]}>
          Служба поддержки
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            accessibilityRole="progressbar"
            accessibilityLabel="Загрузка обращений"
          />
          <Text style={[styles.loaderText, { color: colors.text }]}>
            Загрузка обращений...
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              accessibilityLabel="Обновление списка обращений"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                accessible={false}
                name="chatbubble-ellipses-outline"
                size={48}
                color={colors.text}
                style={{ opacity: 0.5 }}
              />
              <Text accessibilityRole="text" style={[styles.emptyText, { color: colors.text }]}>
                У вас пока нет обращений
              </Text>
              <Text
                accessibilityRole="text"
                style={[styles.emptySubtext, { color: colors.text }]}
              >
                Нажмите кнопку ниже, чтобы создать новое
              </Text>
            </View>
          }
          accessibilityLabel="Список обращений"
        />
      )}

      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Создать новое обращение"
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={handleCreateChat}
        disabled={creating}
      >
        {creating ? (
          <ActivityIndicator
            color="#FFFFFF"
            accessibilityRole="progressbar"
            accessibilityLabel="Создание обращения"
          />
        ) : (
          <>
            <Ionicons name="add" size={20} color="#FFFFFF" accessible={false} />
            <Text accessibilityRole="text" style={styles.createButtonText}>
              Новое обращение
            </Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  chatCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  chatStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chatPreview: {
    fontSize: 14,
    opacity: 0.9,
  },
  chatDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    left: 16,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
});