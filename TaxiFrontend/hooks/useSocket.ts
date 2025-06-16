import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(): React.MutableRefObject<Socket | null> {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connect = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('🚫 Токен не найден для WebSocket');
        return;
      }

      // Если уже подключён — не пересоздаём
      if (socketRef.current?.connected) {
        console.log('ℹ️ WebSocket уже подключён');
        return;
      }

      const socket: Socket = io('http://10.0.2.2:3000/ws', {
        transports: ['websocket'],
        auth: { token },
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        if (!isMounted) return;
        console.log('✅ WebSocket подключён:', socket.id);
      });

      socket.on('connect_error', (err) => {
        if (!isMounted) return;
        console.error('🚫 Ошибка подключения WebSocket:', err.message);
      });

      socket.on('disconnect', (reason) => {
        if (!isMounted) return;
        console.warn('❌ WebSocket отключён:', reason);
      });
    };

    connect();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef;
}