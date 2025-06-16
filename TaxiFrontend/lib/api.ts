import api from './auth';

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  console.log('createOrder response:', response.data);
  return response.data;
};

export const calculateRoutePrice = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) => {
  const response = await api.get('/orders/calculate-price', {
    params: {
      startLat,
      startLng,
      endLat,
      endLng,
    },
  });
  return response.data;
};

export const fetchActiveOrders = async () => {
  const response = await api.get('/orders/active');
  const ordersRaw = response.data;

  return ordersRaw.map((order: any) => {
    const firstSegment = order.segments?.[0];

    return {
      id: order.id,
      type: order.vehicleType || 'Не указан',
      time: firstSegment?.departureTime
        ? new Date(firstSegment.departureTime).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Время не указано',
      from: firstSegment?.fromAddress?.fullAddress || 'Не указан адрес',
      to: firstSegment?.toAddress?.fullAddress || 'Не указан адрес',
      price: 0, // пока нет
      date: firstSegment?.departureTime ?? '', // для группировки
    };
  });
};

export const fetchFinishOrders = async () => {
  const response = await api.get('/orders/finished');
  const ordersRaw = response.data;

  return ordersRaw.map((order: any) => {
    const firstSegment = order.segments?.[0];

    return {
      id: order.id,
      type: order.vehicleType || 'Не указан',
      time: firstSegment?.departureTime
        ? new Date(firstSegment.departureTime).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Время не указано',
      from: firstSegment?.fromAddress?.fullAddress || 'Не указан адрес',
      to: firstSegment?.toAddress?.fullAddress || 'Не указан адрес',
      price: 0, // пока нет
      date: firstSegment?.departureTime ?? '', // для группировки
    };
  });
};

export const fetchOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const saveUserAddress = async (data: any) => {
  const response = await api.post('/user-addresses', data);
  return response.data;
};

export const fetchUserAddresses = async () => {
  const response = await api.get('/user-addresses');
  return response.data;
};

export const fetchUserAddressById = async (id: string) => {
  const response = await api.get(`/user-addresses/${id}`);
  return response.data;
};

export const deleteUserAddress = async (id: string) => {
  const response = await api.delete(`/user-addresses/${id}`);
  return response.data;
};

export const updateUserAddress = async (id: string, data: any) => {
  const response = await api.patch(`/user-addresses/${id}`, data);
  return response.data;
};



export const fetchUserPreferences = async (): Promise<number[]> => {
  const response = await api.get('/user-preferences');
  return response.data.map((item: any) => item.preference.id);
};

export const saveUserPreferences = async (preferenceIds: number[]) => {
  const response = await api.post('/user-preferences', { preferenceIds });
  return response.data;
};


export const cancelOrder = async (orderId: string) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};