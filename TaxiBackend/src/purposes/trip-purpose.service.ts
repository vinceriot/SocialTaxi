import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripPurpose } from './trip-purpose.entity';

@Injectable()
export class TripPurposeService {
  constructor(
    @InjectRepository(TripPurpose)
    private readonly repo: Repository<TripPurpose>,
  ) {}

  findAll(): Promise<TripPurpose[]> {
    return this.repo.find();
  }

  create(name: string): Promise<TripPurpose> {
    return this.repo.save({ name });
  }
}