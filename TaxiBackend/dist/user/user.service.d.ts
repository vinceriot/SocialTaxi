import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
}
