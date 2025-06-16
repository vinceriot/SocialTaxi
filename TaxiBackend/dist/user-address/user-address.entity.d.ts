import { User } from '../user/user.entity';
import { Address } from '../address/address.entity';
export declare class UserAddress {
    id: string;
    user: User;
    address: Address;
    label: string;
    isDefault: boolean;
    createdAt: Date;
}
