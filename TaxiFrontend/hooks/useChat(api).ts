// /app/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { fetchMessages, markMessageRead, Message, sendMessageApi } from '../lib/chat';
import { getCurrentUserId } from '../lib/getCurrentUserId';

type UseChatParams = {
  conversationId: string;
  onError?: (e: unknown) => void;
};



export function useChat({ conversationId, onError }: UseChatParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const flatListRef = useRef<any>(null);
    
  useEffect(() => {
        getCurrentUserId().then(setCurrentUserId); // 👈 3. загрузка userId
    }, []);
    
  // 1) Загрузка истории
  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
      scrollToEnd();
    } catch (e) {
      console.warn('useChat: ошибка загрузки сообщений', e);
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  // 2) Отправка нового сообщения
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text) {
      return;
    }

    // Оптимистичное добавление «черновика»
    const tempId = Date.now().toString();
    const draft: Message = {
      id: tempId,
      sender: { id: currentUserId },
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, draft]);
    setInputText('');
    scrollToEnd();

    try {
      const saved = await sendMessageApi(conversationId, text);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempId
            ? {
                id: saved.id,
                sender: saved.sender,
                text: saved.text,
                timestamp: saved.timestamp,
                read: saved.read,
              }
            : msg
        )
      );
    } catch (e) {
      console.warn('useChat: ошибка отправки', e);
      onError?.(e);
    }
  };

  // 3) Пометка непрочитанных входящих сообщений
  const markAsRead = async (messageId: string) => {
    try {
      await markMessageRead(messageId);
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, read: true } : m))
      );
    } catch (e) {
      console.warn('useChat: ошибка markAsRead', e);
      onError?.(e);
    }
  };

  // Автопрокрутка вниз
  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  // Подписываемся на появление клавиатуры (для автопрокрутки)
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      scrollToEnd();
    });
    return () => {
      showSub.remove();
    };
  }, []);

  // Загружаем все сообщения при монтировании и при смене conversationId
  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  return {
    messages,
    inputText,
    setInputText,
    loading,
    flatListRef,
    sendMessage,
    markAsRead,
  };
}