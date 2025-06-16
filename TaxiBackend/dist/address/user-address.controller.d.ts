import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './CreateUserAddressDto';
export declare class UserAddressController {
    private readonly userAddressService;
    constructor(userAddressService: UserAddressService);
    create(dto: CreateUserAddressDto, req: any): Promise<import("./user-address.entity").UserAddress>;
    findAll(req: any): Promise<import("./user-address.entity").UserAddress[]>;
    findOne(id: string): Promise<import("./user-address.entity").UserAddress | null>;
    remove(id: string, req: any): Promise<import("typeorm").DeleteResult>;
    update(id: string, dto: CreateUserAddressDto, req: any): Promise<import("./user-address.entity").UserAddress>;
}
