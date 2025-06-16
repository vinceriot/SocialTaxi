import { User } from '../user/user.entity';
import { Address } from './address.entity';
export declare class UserAddress {
    id: string;
    user: User;
    address: Address;
    label: string;
}
