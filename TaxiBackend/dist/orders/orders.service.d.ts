import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../user/user.entity';
import { Status } from '../status/status.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderPreference } from '../preferences/order-preferences.entity';
import { Address } from '../address/address.entity';
import { Segment } from '../segments/segment.entity';
import { OrderResponseDto } from './dto/response-order.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly statusRepository;
    private readonly orderPreferenceRepository;
    private readonly addressRepository;
    private readonly segmentRepository;
    private readonly userRepository;
    private readonly httpService;
    private readonly configService;
    constructor(orderRepository: Repository<Order>, statusRepository: Repository<Status>, orderPreferenceRepository: Repository<OrderPreference>, addressRepository: Repository<Address>, segmentRepository: Repository<Segment>, userRepository: Repository<User>, httpService: HttpService, configService: ConfigService);
    create(dto: CreateOrderDto, userId: string): Promise<Order>;
    findAll(userId: string): Promise<OrderResponseDto[]>;
    findOne(id: string, userId: string): Promise<Order>;
    update(id: string, dto: UpdateOrderDto): Promise<Order>;
    cancelOrder(id: string, userId: string): Promise<void>;
    remove(id: string, userId: string): Promise<void>;
    getOrdersByStatuses(statusCodes: string[], userId: string): Promise<OrderResponseDto[]>;
    getActiveOrders(userId: string): Promise<OrderResponseDto[]>;
    calculateRouteCost(start: [number, number], end: [number, number], vehicleType: 'car' | 'minivan'): Promise<number>;
    calculateAllPrices(start: [number, number], end: [number, number]): Promise<{
        standard: {
            full: number;
            discounted: number;
        };
        special: {
            full: number;
            discounted: number;
        };
    }>;
}
