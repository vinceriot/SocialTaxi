import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: string;
    };
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, req: RequestWithUser): Promise<{
        id: string;
    }>;
    findAll(req: RequestWithUser): Promise<import("./dto/response-order.dto").OrderResponseDto[]>;
    getFinishedOrders(req: RequestWithUser): Promise<import("./dto/response-order.dto").OrderResponseDto[]>;
    getActiveOrders(req: RequestWithUser): Promise<import("./dto/response-order.dto").OrderResponseDto[]>;
    calculatePrice(startLat: string, startLng: string, endLat: string, endLng: string): Promise<{
        standard: {
            full: number;
            discounted: number;
        };
        special: {
            full: number;
            discounted: number;
        };
    }>;
    cancelOrder(id: string, req: RequestWithUser): Promise<{
        success: boolean;
    }>;
    findOne(id: string, req: RequestWithUser): Promise<import("./entities/order.entity").Order>;
}
export {};
