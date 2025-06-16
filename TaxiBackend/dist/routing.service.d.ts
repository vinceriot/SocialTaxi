export declare class RoutingService {
    private readonly ORS_API_KEY;
    private readonly BASE_URL;
    getDistanceInMeters(start: [number, number], end: [number, number]): Promise<number>;
}
