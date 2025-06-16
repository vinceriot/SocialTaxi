// routing.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RoutingService {
  private readonly ORS_API_KEY = process.env.ORS_API_KEY;
  private readonly BASE_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

  async getDistanceInMeters(start: [number, number], end: [number, number]): Promise<number> {
    const url = `${this.BASE_URL}?api_key=${this.ORS_API_KEY}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;
    const response = await axios.get(url);

    const distance = response.data?.features?.[0]?.properties?.segments?.[0]?.distance;

    if (!distance) throw new Error('Не удалось получить расстояние');

    return distance; // В метрах
  }
}