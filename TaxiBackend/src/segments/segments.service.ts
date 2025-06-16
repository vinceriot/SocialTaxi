import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from './segment.entity';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepo: Repository<Segment>,
  ) {}

  async create(dto: CreateSegmentDto): Promise<Segment> {
    const segment = new Segment();
    segment.order = { id: dto.orderId } as any;
    segment.driver = { id: dto.driverId } as any;
    segment.vehicle = { id: dto.vehicleId } as any;
    segment.fromAddress = { id: dto.fromAddressId } as any;
    segment.toAddress = { id: dto.toAddressId } as any;
    segment.status = { id: dto.statusId } as any;
    segment.departureTime = new Date(dto.departureTime);
    segment.arrivalTime = new Date(dto.arrivalTime);
    segment.comment = dto.comment ?? '';
    return this.segmentRepo.save(segment);
  }

  findAll(): Promise<Segment[]> {
    return this.segmentRepo.find({
      relations: ['order', 'driver', 'vehicle', 'fromAddress', 'toAddress', 'status'],
    });
  }

  async findOne(id: string): Promise<Segment> {
    const segment = await this.segmentRepo.findOne({
      where: { id },
      relations: ['order', 'driver', 'vehicle', 'fromAddress', 'toAddress', 'status'],
    });
    if (!segment) {
      throw new NotFoundException(`Segment ${id} not found`);
    }
    return segment;
  }

  async update(id: string, dto: UpdateSegmentDto): Promise<Segment> {
    const segment = await this.findOne(id);
    Object.assign(segment, {
      ...dto,
      order: dto.orderId ? { id: dto.orderId } : segment.order,
      driver: dto.driverId ? { userId: dto.driverId } : segment.driver,
      vehicle: dto.vehicleId ? { id: dto.vehicleId } : segment.vehicle,
      fromAddress: dto.fromAddressId ? { id: dto.fromAddressId } : segment.fromAddress,
      toAddress: dto.toAddressId ? { id: dto.toAddressId } : segment.toAddress,
      status: dto.statusId ? { id: dto.statusId } : segment.status,
    });
    return this.segmentRepo.save(segment);
  }

  async remove(id: string): Promise<void> {
    const segment = await this.findOne(id);
    await this.segmentRepo.remove(segment);
  }
}