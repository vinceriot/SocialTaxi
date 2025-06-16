import { useEffect } from 'react';
import { useOrderStore } from '../app/stores/orderStore';
import { calculateRoutePrice } from '../lib/api'; // путь укажи по своей структуре

export const useAutoCalculatePrice = () => {
  const {
    fromCoord,
    toCoord,
    setRoutePrice,
  } = useOrderStore();

  useEffect(() => {
    const fetchPrice = async () => {
      if (fromCoord && toCoord) {
        try {
          const result = await calculateRoutePrice(
            fromCoord.latitude,
            fromCoord.longitude,
            toCoord.latitude,
            toCoord.longitude
          );
          setRoutePrice(result);
        } catch (error) {
          console.warn('Ошибка при расчете стоимости маршрута:', error);
          setRoutePrice(null);
        }
      } else {
        // если одна из координат сброшена, очищаем цену
        setRoutePrice(null);
      }
    };

    fetchPrice();
  }, [fromCoord, toCoord]);
};