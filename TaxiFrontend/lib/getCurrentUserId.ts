//getCurrentUserId
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  sub: string;
  // можешь добавить ещё поля, если хочешь использовать имя, роль и т.д.
};

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode<any>(token);
    return decoded.sub;
  } catch (e) {
    console.warn('❌ Ошибка при расшифровке токена:', e);
    return null;
  }
}