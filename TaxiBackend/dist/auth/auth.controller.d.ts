import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<any>;
    logout(req: any): Promise<{
        success: boolean;
    }>;
}
