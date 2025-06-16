// src/stores/currentOrderStore.ts

import { create } from 'zustand'
import { Order } from '../../.expo/types/order'
import { fetchOrderById } from '../../lib/api'

interface CurrentOrderStore {
  order: Order | null
  loading: boolean
  error: string | null

  loadOrder: (orderId: string) => Promise<void>
  clearCurrentOrder: () => void
  refreshOrder: () => Promise<void>
}

export const useCurrentOrderStore = create<CurrentOrderStore>((set, get) => ({
  order: null,
  loading: false,
  error: null,

  // Загружает по ID и сохраняет в state.order
  loadOrder: async (orderId: string) => {
    set({ loading: true, error: null })
    try {
      const data = await fetchOrderById(orderId)
      console.log('loadOrder response:', data)
      set({ order: data })
    } catch (e: any) {
      set({ error: e.message || 'Не удалось загрузить заказ' })
    } finally {
      set({ loading: false })
    }
  },

  // Просто сбрасываем «текущий» заказ (например, при выходе из экрана или после окончания поездки)
  clearCurrentOrder: () => {
    set({ order: null, loading: false, error: null })
  },

  // Если нужен «обновить» (например, статус меняется каждые 30 секунд), вызываем fetchOrderById снова
  refreshOrder: async () => {
    const orderId = get().order?.id
    if (!orderId) return
    set({ loading: true, error: null })
    try {
      const data = await fetchOrderById(orderId)
      console.log('refreshOrder response:', data)
      set({ order: data })
    } catch (e: any) {
      set({ error: e.message || 'Ошибка при обновлении' })
    } finally {
      set({ loading: false })
    }
  },
}))