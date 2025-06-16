declare class CreateAddressDto {
    country?: string;
    city: string;
    region?: string;
    street: string;
    house: string;
    apartment?: string;
    entrance?: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
}
declare class CreateSegmentDto {
    fromAddress: CreateAddressDto;
    toAddress: CreateAddressDto;
    departureTime: string;
}
export declare class CreateOrderDto {
    vehicleType: string;
    purposeId: number;
    comment?: string;
    preferenceIds?: number[];
    segments: CreateSegmentDto[];
}
export {};
