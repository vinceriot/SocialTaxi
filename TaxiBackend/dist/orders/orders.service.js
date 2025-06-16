"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../user/user.entity");
const status_entity_1 = require("../status/status.entity");
const order_preferences_entity_1 = require("../preferences/order-preferences.entity");
const address_entity_1 = require("../address/address.entity");
const segment_entity_1 = require("../segments/segment.entity");
const response_order_dto_1 = require("./dto/response-order.dto");
const typeorm_3 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let OrdersService = class OrdersService {
    orderRepository;
    statusRepository;
    orderPreferenceRepository;
    addressRepository;
    segmentRepository;
    userRepository;
    httpService;
    configService;
    constructor(orderRepository, statusRepository, orderPreferenceRepository, addressRepository, segmentRepository, userRepository, httpService, configService) {
        this.orderRepository = orderRepository;
        this.statusRepository = statusRepository;
        this.orderPreferenceRepository = orderPreferenceRepository;
        this.addressRepository = addressRepository;
        this.segmentRepository = segmentRepository;
        this.userRepository = userRepository;
        this.httpService = httpService;
        this.configService = configService;
    }
    async create(dto, userId) {
        const order = new order_entity_1.Order();
        order.user = await this.userRepository.findOneByOrFail({ id: userId });
        order.comment = dto.comment ?? '';
        order.vehicleType = dto.vehicleType;
        order.purpose = { id: dto.purposeId };
        order.status = await this.statusRepository.findOneByOrFail({ code: 'waiting_assignment' });
        const savedOrder = await this.orderRepository.save(order);
        if (dto.preferenceIds?.length) {
            const preferences = dto.preferenceIds.map((id) => this.orderPreferenceRepository.create({
                order: savedOrder,
                preference: { id },
            }));
            await this.orderPreferenceRepository.save(preferences);
        }
        for (const seg of dto.segments) {
            const from = await this.addressRepository.save(this.addressRepository.create(seg.fromAddress));
            const to = await this.addressRepository.save(this.addressRepository.create(seg.toAddress));
            const segment = this.segmentRepository.create({
                order: savedOrder,
                fromAddress: from,
                toAddress: to,
                departureTime: new Date(seg.departureTime),
                status: await this.statusRepository.findOneByOrFail({ code: 'waiting_assignment' }),
            });
            await this.segmentRepository.save(segment);
        }
        return savedOrder;
    }
    async findAll(userId) {
        const orders = await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: [
                'status',
                'segments',
                'segments.status',
                'segments.fromAddress',
                'segments.toAddress',
            ],
            order: {
                createdAt: 'DESC',
            },
        });
        return (0, class_transformer_1.plainToInstance)(response_order_dto_1.OrderResponseDto, orders, {
            excludeExtraneousValues: true,
        });
    }
    async findOne(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'status',
                'segments',
                'segments.status',
                'segments.vehicle',
                'segments.driver',
                'segments.fromAddress',
                'segments.toAddress',
                'preferences',
                'user',
            ],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        if (order.user.id !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этому заказу');
        }
        return order;
    }
    async update(id, dto) {
        const order = await this.findOne(id, dto.userId);
        order.comment = dto.comment ?? order.comment;
        return this.orderRepository.save(order);
    }
    async cancelOrder(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'segments'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.user.id !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to cancel this order');
        }
        const cancelledStatus = await this.statusRepository.findOneByOrFail({ code: 'cancelled' });
        order.status = cancelledStatus;
        await this.orderRepository.save(order);
        if (order.segments && order.segments.length) {
            for (const segment of order.segments) {
                segment.status = cancelledStatus;
                await this.segmentRepository.save(segment);
            }
        }
    }
    async remove(id, userId) {
        const order = await this.findOne(id, userId);
        await this.orderRepository.remove(order);
    }
    async getOrdersByStatuses(statusCodes, userId) {
        const orders = await this.orderRepository.find({
            where: {
                user: { id: userId },
                status: { code: (0, typeorm_3.In)(statusCodes) },
            },
            relations: [
                'status',
                'segments',
                'segments.status',
                'segments.fromAddress',
                'segments.toAddress',
            ],
            order: {
                createdAt: 'DESC',
            },
        });
        return (0, class_transformer_1.plainToInstance)(response_order_dto_1.OrderResponseDto, orders, {
            excludeExtraneousValues: true,
        });
    }
    async getActiveOrders(userId) {
        const orders = await this.orderRepository.find({
            where: {
                user: { id: userId },
                status: { code: (0, typeorm_3.Not)((0, typeorm_3.In)(['completed', 'cancelled'])) },
            },
            relations: [
                'status',
                'segments',
                'segments.status',
                'segments.fromAddress',
                'segments.toAddress',
            ],
            order: {
                createdAt: 'DESC',
            },
        });
        return (0, class_transformer_1.plainToInstance)(response_order_dto_1.OrderResponseDto, orders, {
            excludeExtraneousValues: true,
        });
    }
    async calculateRouteCost(start, end, vehicleType) {
        const apiKey = this.configService.get('ORS_API_KEY');
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url));
        const distance = response.data?.features?.[0]?.properties?.segments?.[0]?.distance;
        if (!distance)
            throw new Error('Не удалось получить расстояние маршрута');
        const distanceInKm = distance / 1000;
        const tariffs = {
            car: { base: 100, perKm: 20 },
            minivan: { base: 150, perKm: 35 },
        };
        const { base, perKm } = tariffs[vehicleType];
        const total = base + distanceInKm * perKm;
        return Math.round(total);
    }
    async calculateAllPrices(start, end) {
        const [car, minivan] = await Promise.all([
            this.calculateRouteCost(start, end, 'car'),
            this.calculateRouteCost(start, end, 'minivan'),
        ]);
        const discountRate = 0.3;
        return {
            standard: {
                full: car,
                discounted: Math.round(car * discountRate),
            },
            special: {
                full: minivan,
                discounted: Math.round(minivan * discountRate),
            },
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(status_entity_1.Status)),
    __param(2, (0, typeorm_1.InjectRepository)(order_preferences_entity_1.OrderPreference)),
    __param(3, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(4, (0, typeorm_1.InjectRepository)(segment_entity_1.Segment)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map