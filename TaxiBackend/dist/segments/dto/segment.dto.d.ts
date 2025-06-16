import { AddressDto } from '../../address/adress.dto';
export declare class SegmentDto {
    id: string;
    fromAddress: AddressDto;
    toAddress: AddressDto;
    departureTime: Date;
    arrivalTime: Date;
    comment: string;
    status: {
        code: string;
        name: string;
    };
}
