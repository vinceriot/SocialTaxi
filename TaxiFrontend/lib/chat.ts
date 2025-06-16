// lib/chat.ts
import api from './auth'; // Предполагается, что в auth.ts экспортируется axios-инстанс с интерсептором для Authorization

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO-строка
  read: boolean;
};

// Тип, описывающий разговор «user ↔ support»
export type SupportConversation = {
  id: string;
  type: 'user_support';
  participants: { userId: string; role: string }[];
  createdAt: string;
  updatedAt: string;
  // При необходимости можно добавить любые другие поля
};

/**
 * 1) Создать чат «user ↔ driver»
 */
export async function createUserDriverChat(driverId: string): Promise<string> {
  const response = await api.post<{ conversationId: string }>('/chats/user-driver', {
    driverId,
  });
  return response.data.conversationId;
}

/**
 * 2) Создать чат «user ↔ support»
 *    Серверная точка: POST /chats/support
 *    В заголовках автоматически передаётся JWT, чтобы бекенд через @UserId() достал userId.
 */
export async function createUserSupportChat(): Promise<string> {
  const response = await api.post<{ conversationId: string }>('/chats/user-support');
  return response.data.conversationId;
}

/**
 * 3) Создать чат «driver ↔ support»
 */
export async function createDriverSupportChat(): Promise<string> {
  const response = await api.post<{ conversationId: string }>('/chats/driver-support');
  return response.data.conversationId;
}

/**
 * 4) Отправить сообщение (senderId берётся из JWT через интерсептор)
 */
export async function sendMessageApi(
  conversationId: string,
  text: string
): Promise<Message> {
  const response = await api.post<Message>('/chats/message', {
    conversationId,
    text,
  });
  return response.data;
}

/**
 * 5) Получить историю сообщений (опционально с since)
 */
export async function fetchMessages(
  conversationId: string,
  sinceIso?: string
): Promise<Message[]> {
  const query = sinceIso ? `?since=${encodeURIComponent(sinceIso)}` : '';
  const response = await api.get<Message[]>(`/chats/${conversationId}/messages${query}`);
  return response.data;
}

/**
 * 6) Пометить сообщение как «прочитанное»
 */
export async function markMessageRead(messageId: string): Promise<void> {
  await api.post('/chats/read', { messageId });
}

/**
 * 7) Получение всех чатов «user ↔ support» для текущего пользователя
 *    Серверная точка: GET /chats/support
 */
export async function fetchUserSupportChats(): Promise<SupportConversation[]> {
  const response = await api.get<SupportConversation[]>('/chats/support');
  return response.data;
}