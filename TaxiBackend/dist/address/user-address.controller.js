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
exports.UserAddressController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_address_service_1 = require("./user-address.service");
const CreateUserAddressDto_1 = require("./CreateUserAddressDto");
let UserAddressController = class UserAddressController {
    userAddressService;
    constructor(userAddressService) {
        this.userAddressService = userAddressService;
    }
    create(dto, req) {
        return this.userAddressService.create(dto, req.user.id);
    }
    findAll(req) {
        return this.userAddressService.findAllByUser(req.user.id);
    }
    findOne(id) {
        return this.userAddressService.findOneById(id);
    }
    remove(id, req) {
        return this.userAddressService.deleteByIdAndUser(id, req.user.id);
    }
    update(id, dto, req) {
        return this.userAddressService.update(id, dto, req.user.id);
    }
};
exports.UserAddressController = UserAddressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserAddressDto_1.CreateUserAddressDto, Object]),
    __metadata("design:returntype", void 0)
], UserAddressController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserAddressController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserAddressController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserAddressController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateUserAddressDto_1.CreateUserAddressDto, Object]),
    __metadata("design:returntype", void 0)
], UserAddressController.prototype, "update", null);
exports.UserAddressController = UserAddressController = __decorate([
    (0, common_1.Controller)('user-addresses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_address_service_1.UserAddressService])
], UserAddressController);
//# sourceMappingURL=user-address.controller.js.map