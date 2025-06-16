import { User } from '../../user/user.entity';
export declare class Session {
    id: number;
    token: string;
    user: User;
    createdAt: Date;
}
