import { UsersService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: number;
    };
}
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    create(dto: CreateUserDto): Promise<import("./user.entity").User>;
    getMe(req: RequestWithUser): Promise<import("./user.entity").User | null>;
}
export {};
