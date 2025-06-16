import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  timeout: 10000,
  withCredentials: true,
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  console.log('👉 Интерсептор вставляет токен:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = async (phone: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      phoneNumber: phone,
      password,
    });

    console.log('✅ Ответ от сервера:', response.data);

    const { access_token, user } = response.data;
    await AsyncStorage.setItem('token', access_token);
    return user;

  } catch (error) {
    console.error('❌ Ошибка внутри loginUser:', error);
    throw error;
  }
};

export const registerUser = async (
  name: string,
  phone: string,
  email: string,
  password: string
) => {
  const response = await api.post('/users', {
    firstName: name,
    phoneNumber: phone,
    email,
    password,
  });

  return response.data;
};

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    console.log('✅ Сервер ответил на logout:', response.data);
  } catch (e) {
    console.warn('❌ Ошибка при logout на сервере:', (e as any)?.message);
  }

  await AsyncStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при получении текущего пользователя:', error);
    throw error;
  }
};

export default api;