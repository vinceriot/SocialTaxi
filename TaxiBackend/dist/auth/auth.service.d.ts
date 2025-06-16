import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Session } from './entities/session.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly sessionRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, sessionRepo: Repository<Session>, jwtService: JwtService);
    login(dto: {
        phoneNumber: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    logout(token: string): Promise<{
        success: boolean;
    }>;
}
