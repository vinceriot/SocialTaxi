import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { fetchMessages, markMessageRead, Message } from '../lib/chat';
import { getCurrentUserId } from '../lib/getCurrentUserId';
import { useSocket } from './useSocket';


type UseChatParams = {
  conversationId: string;
  onError?: (e: unknown) => void;
};

export function useChat({ conversationId, onError }: UseChatParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const flatListRef = useRef<any>(null);
  const socketRef = useSocket();

  // Загрузка userId и сообщений
  useEffect(() => {
    const init = async () => {
      const uid = await getCurrentUserId();
      setCurrentUserId(uid);
      await loadMessages();
    };
    init();
  }, [conversationId]);

  // Загрузка истории сообщений
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

  // Подписка на WebSocket чат
  useEffect(() => {
  const socket = socketRef.current;
  if (!socket || !conversationId) return;

  const joinRoom = () => {
    console.log('📨 chat:join отправлен с conversationId:', conversationId);
    socket.emit('chat:join', conversationId);
  };

  if (socket.connected) {
    joinRoom();
  } else {
    socket.on('connect', joinRoom);
  }

  const handler = (msg: any) => {
    const newMessage: Message = {
      id: msg.id || Date.now().toString(),
      sender: { id: msg.from },
      text: msg.text,
      timestamp: msg.timestamp || new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    scrollToEnd();
  };

  socket.on('chat:message', handler);

  return () => {
    socket.off('chat:message', handler);
    socket.off('connect', joinRoom); // ❗ важно удалить
  };
}, [socketRef.current, conversationId]);

  // Отправка через WebSocket
  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || !socketRef.current) return;

    const tempId = Date.now().toString();
    const draft: Message = {
      id: tempId,
      sender: { id: currentUserId || 'self' },
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, draft]);
    setInputText('');
    scrollToEnd();

    socketRef.current.emit('chat:send', {
      conversationId,
      text,
    });
  };

  // Пометка прочитанного
  const markAsRead = async (messageId: string) => {
    try {
      await markMessageRead(messageId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
      );
    } catch (e) {
      console.warn('useChat: ошибка markAsRead', e);
      onError?.(e);
    }
  };

  // Автопрокрутка
  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', scrollToEnd);
    return () => showSub.remove();
  }, []);

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