import { User } from '../../user/user.entity';
export declare class Role {
    roleId: number;
    name: string;
    description: string;
    users: User[];
}
