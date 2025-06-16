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
exports.SegmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const segment_entity_1 = require("./segment.entity");
let SegmentsService = class SegmentsService {
    segmentRepo;
    constructor(segmentRepo) {
        this.segmentRepo = segmentRepo;
    }
    async create(dto) {
        const segment = new segment_entity_1.Segment();
        segment.order = { id: dto.orderId };
        segment.driver = { id: dto.driverId };
        segment.vehicle = { id: dto.vehicleId };
        segment.fromAddress = { id: dto.fromAddressId };
        segment.toAddress = { id: dto.toAddressId };
        segment.status = { id: dto.statusId };
        segment.departureTime = new Date(dto.departureTime);
        segment.arrivalTime = new Date(dto.arrivalTime);
        segment.comment = dto.comment ?? '';
        return this.segmentRepo.save(segment);
    }
    findAll() {
        return this.segmentRepo.find({
            relations: ['order', 'driver', 'vehicle', 'fromAddress', 'toAddress', 'status'],
        });
    }
    async findOne(id) {
        const segment = await this.segmentRepo.findOne({
            where: { id },
            relations: ['order', 'driver', 'vehicle', 'fromAddress', 'toAddress', 'status'],
        });
        if (!segment) {
            throw new common_1.NotFoundException(`Segment ${id} not found`);
        }
        return segment;
    }
    async update(id, dto) {
        const segment = await this.findOne(id);
        Object.assign(segment, {
            ...dto,
            order: dto.orderId ? { id: dto.orderId } : segment.order,
            driver: dto.driverId ? { userId: dto.driverId } : segment.driver,
            vehicle: dto.vehicleId ? { id: dto.vehicleId } : segment.vehicle,
            fromAddress: dto.fromAddressId ? { id: dto.fromAddressId } : segment.fromAddress,
            toAddress: dto.toAddressId ? { id: dto.toAddressId } : segment.toAddress,
            status: dto.statusId ? { id: dto.statusId } : segment.status,
        });
        return this.segmentRepo.save(segment);
    }
    async remove(id) {
        const segment = await this.findOne(id);
        await this.segmentRepo.remove(segment);
    }
};
exports.SegmentsService = SegmentsService;
exports.SegmentsService = SegmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(segment_entity_1.Segment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SegmentsService);
//# sourceMappingURL=segments.service.js.map