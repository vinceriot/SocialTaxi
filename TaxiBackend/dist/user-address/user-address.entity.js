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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddress = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const address_entity_1 = require("../address/address.entity");
let UserAddress = class UserAddress {
    id;
    user;
    address;
    label;
    isDefault;
    createdAt;
};
exports.UserAddress = UserAddress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserAddress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], UserAddress.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address),
    __metadata("design:type", address_entity_1.Address)
], UserAddress.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserAddress.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserAddress.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserAddress.prototype, "createdAt", void 0);
exports.UserAddress = UserAddress = __decorate([
    (0, typeorm_1.Entity)('user_addresses')
], UserAddress);
//# sourceMappingURL=user-address.entity.js.map