import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatView } from '../components/ChatView';
import { useChat } from '../hooks/useChat';
import { getCurrentUserId } from '../lib/getCurrentUserId';

type ChatRouteParams = {
  ChatScreen: {
    conversationId: string;
    title: string;
  };
};

function ChatScreenInner() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<ChatRouteParams, 'ChatScreen'>>();
  const { conversationId, title } = route.params;

  const {
    messages,
    inputText,
    setInputText,
    loading,
    flatListRef,
    sendMessage,
    markAsRead,
  } = useChat({
    conversationId,
    onError: (e) => {
      console.warn('ChatScreen useChat error', e);
      // Здесь можно добавить обработку ошибок для пользователя
    },
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await markAsRead(); // или перезагрузка сообщений, если есть такая функция
    } catch (err) {
      console.warn('Ошибка при обновлении чата', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    (async () => {
      const id = await getCurrentUserId();
      console.log('🔑 Получен currentUserId из токена:', id);
      setCurrentUserId(id);
    })();
  }, []);

  if (!currentUserId) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaView>
    );
  }

  // Помечаем сообщения как прочитанные при открытии экрана
 /*  useEffect(() => {
    markMessageRead();
  }, []); */

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['bottom']} // Учитываем нижний инсет (для iPhone с "чёлкой")
    >
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.card}
      />
      
      <ChatView
        title={title}
        messages={messages.map((m) => ({
          id: m.id,
          text: m.text,
          senderId: m.sender.id === currentUserId ? 'self' : m.sender.id,
          createdAt: m.sentAt,
          accessibilityLabel: `Сообщение ${m.sender.id === currentUserId ? 'ваше' : 'от собеседника'}: ${m.text}. Отправлено ${new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }))}
        inputText={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
        onBack={() => navigation.goBack()}
        flatListRef={flatListRef}
        //markAsRead={markAsRead}
        loading={loading}
        // Пропсы для кастомизации стилей
        headerStyle={{
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        }}
        headerTitleStyle={{
          color: colors.text,
        }}
        inputContainerStyle={{
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        }}
        myMessageStyle={{
          backgroundColor: colors.primary,
        }}
        otherMessageStyle={{
          backgroundColor: colors.card,
        }}
        myMessageTextStyle={{
          color: '#fff',
        }}
        otherMessageTextStyle={{
          color: colors.text,
        }}
        timeTextStyle={{
          color: colors.text,
          opacity: 0.6,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}

export default React.memo(ChatScreenInner);