import { SegmentDto } from '../../segments/dto/segment.dto';
export declare class OrderResponseDto {
    id: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    vehicleType: string;
    status: {
        code: string;
        name: string;
    } | null;
    segments: SegmentDto[];
}
