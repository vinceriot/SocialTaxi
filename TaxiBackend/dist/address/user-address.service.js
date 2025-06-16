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
exports.UserAddressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_address_entity_1 = require("./user-address.entity");
const address_entity_1 = require("./address.entity");
const user_entity_1 = require("../user/user.entity");
let UserAddressService = class UserAddressService {
    userAddressRepo;
    addressRepo;
    userRepo;
    constructor(userAddressRepo, addressRepo, userRepo) {
        this.userAddressRepo = userAddressRepo;
        this.addressRepo = addressRepo;
        this.userRepo = userRepo;
    }
    async create(dto, userId) {
        const address = this.addressRepo.create(dto.address);
        const savedAddress = await this.addressRepo.save(address);
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new Error('User not found');
        const userAddress = this.userAddressRepo.create({
            user,
            address: savedAddress,
            label: dto.label,
        });
        return this.userAddressRepo.save(userAddress);
    }
    async findAllByUser(userId) {
        return this.userAddressRepo.find({
            where: { user: { id: userId } },
            relations: ['address'],
        });
    }
    async findOneById(id) {
        return this.userAddressRepo.findOne({
            where: { id },
            relations: ['address'],
        });
    }
    async deleteByIdAndUser(id, userId) {
        return this.userAddressRepo
            .createQueryBuilder()
            .delete()
            .where('id = :id AND userId = :userId', { id, userId })
            .execute();
    }
    async update(id, dto, userId) {
        const address = this.addressRepo.create(dto.address);
        const savedAddress = await this.addressRepo.save(address);
        const userAddress = await this.userAddressRepo.findOne({
            where: { id, user: { id: userId } },
            relations: ['user'],
        });
        if (!userAddress)
            throw new Error('User address not found');
        userAddress.label = dto.label;
        userAddress.address = savedAddress;
        return this.userAddressRepo.save(userAddress);
    }
};
exports.UserAddressService = UserAddressService;
exports.UserAddressService = UserAddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_address_entity_1.UserAddress)),
    __param(1, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserAddressService);
//# sourceMappingURL=user-address.service.js.map