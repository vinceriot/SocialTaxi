import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './CreateUserAddressDto';
import { UserAddress } from './user-address.entity';
import { Address } from './address.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepo: Repository<UserAddress>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // добавь сюда
  ) {}

  async create(dto: CreateUserAddressDto, userId: string) {
    const address = this.addressRepo.create(dto.address);
    const savedAddress = await this.addressRepo.save(address);

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const userAddress = this.userAddressRepo.create({
      user,
      address: savedAddress,
      label: dto.label,
    });

    return this.userAddressRepo.save(userAddress);
  }

  async findAllByUser(userId: string) {
    return this.userAddressRepo.find({
      where: { user: { id: userId } },
      relations: ['address'],
    });
  }

  async findOneById(id: string) {
    return this.userAddressRepo.findOne({
      where: { id },
      relations: ['address'],
    });
  }
  async deleteByIdAndUser(id: string, userId: string) {
    return this.userAddressRepo
      .createQueryBuilder()
      .delete()
      .where('id = :id AND userId = :userId', { id, userId })
      .execute();
  }

  async update(id: string, dto: CreateUserAddressDto, userId: string) {
    const address = this.addressRepo.create(dto.address);
    const savedAddress = await this.addressRepo.save(address); // создаём новый адрес

    const userAddress = await this.userAddressRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!userAddress) throw new Error('User address not found');

    userAddress.label = dto.label;
    userAddress.address = savedAddress;

    return this.userAddressRepo.save(userAddress);
  }
}