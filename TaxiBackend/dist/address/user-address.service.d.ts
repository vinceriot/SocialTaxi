import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './CreateUserAddressDto';
import { UserAddress } from './user-address.entity';
import { Address } from './address.entity';
import { User } from '../user/user.entity';
export declare class UserAddressService {
    private readonly userAddressRepo;
    private readonly addressRepo;
    private readonly userRepo;
    constructor(userAddressRepo: Repository<UserAddress>, addressRepo: Repository<Address>, userRepo: Repository<User>);
    create(dto: CreateUserAddressDto, userId: string): Promise<UserAddress>;
    findAllByUser(userId: string): Promise<UserAddress[]>;
    findOneById(id: string): Promise<UserAddress | null>;
    deleteByIdAndUser(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
    update(id: string, dto: CreateUserAddressDto, userId: string): Promise<UserAddress>;
}
