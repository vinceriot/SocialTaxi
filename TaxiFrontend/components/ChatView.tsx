// components/ChatView.tsx
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  accessibilityLabel?: string;
}

interface ChatViewProps {
  title: string;
  messages: Message[];
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onBack: () => void;
  flatListRef: React.RefObject<FlatList>;
  markAsRead: () => void;
  loading?: boolean;
  headerStyle?: object;
  headerTitleStyle?: object;
  inputContainerStyle?: object;
  myMessageStyle?: object;
  otherMessageStyle?: object;
  myMessageTextStyle?: object;
  otherMessageTextStyle?: object;
  timeTextStyle?: object;
}

export const ChatView: React.FC<ChatViewProps> = ({
  title,
  messages,
  inputText,
  onChangeText,
  onSend,
  onBack,
  flatListRef,
  markAsRead,
  loading = false,
  headerStyle = {},
  headerTitleStyle = {},
  inputContainerStyle = {},
  myMessageStyle = {},
  otherMessageStyle = {},
  myMessageTextStyle = {},
  otherMessageTextStyle = {},
  timeTextStyle = {},
}) => {
  const { colors } = useTheme();

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === 'self';
    const messageTime = new Date(item.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage 
            ? [styles.myMessage, myMessageStyle] 
            : [styles.otherMessage, otherMessageStyle],
        ]}
        accessible
        accessibilityLabel={item.accessibilityLabel}
        accessibilityRole="text"
      >
        <Text
          style={[
            styles.messageText,
            isMyMessage 
              ? [styles.myMessageText, myMessageTextStyle] 
              : [styles.otherMessageText, otherMessageTextStyle],
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timeText,
            timeTextStyle,
            isMyMessage ? { color: 'rgba(255,255,255,0.7)' } : {},
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {messageTime}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Шапка чата */}
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessible
          accessibilityLabel="Назад"
          accessibilityRole="button"
          accessibilityHint="Вернуться к предыдущему экрану"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, headerTitleStyle]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Список сообщений */}
      {loading && messages.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
          onEndReached={markAsRead}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          accessibilityLabel="История сообщений"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: colors.text, opacity: 0.6 }}>
                Нет сообщений
              </Text>
            </View>
          }
        />
      )}

      {/* Поле ввода */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={[styles.inputContainer, inputContainerStyle]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={inputText}
            onChangeText={onChangeText}
            placeholder="Написать сообщение..."
            placeholderTextColor={colors.text}
            accessibilityLabel="Поле ввода сообщения"
            accessibilityHint="Введите текст сообщения"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: colors.primary,
                opacity: inputText.trim() ? 1 : 0.5,
              },
            ]}
            onPress={onSend}
            disabled={!inputText.trim()}
            accessible
            accessibilityLabel="Отправить сообщение"
            accessibilityRole="button"
            accessibilityState={{ disabled: !inputText.trim() }}
          >
            <Ionicons
              name="send"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRightPlaceholder: {
    width: 32,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
});