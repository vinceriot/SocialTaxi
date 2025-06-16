import { Repository } from 'typeorm';
import { Segment } from './segment.entity';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
export declare class SegmentsService {
    private readonly segmentRepo;
    constructor(segmentRepo: Repository<Segment>);
    create(dto: CreateSegmentDto): Promise<Segment>;
    findAll(): Promise<Segment[]>;
    findOne(id: string): Promise<Segment>;
    update(id: string, dto: UpdateSegmentDto): Promise<Segment>;
    remove(id: string): Promise<void>;
}
