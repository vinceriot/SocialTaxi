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
exports.Segment = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../user/user.entity");
const vehicle_entity_1 = require("../vehicles/vehicle.entity");
const address_entity_1 = require("../address/address.entity");
const status_entity_1 = require("../status/status.entity");
let Segment = class Segment {
    id;
    order;
    driver;
    vehicle;
    fromAddress;
    toAddress;
    status;
    departureTime;
    arrivalTime;
    comment;
};
exports.Segment = Segment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Segment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    __metadata("design:type", order_entity_1.Order)
], Segment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Segment.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], Segment.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address),
    __metadata("design:type", address_entity_1.Address)
], Segment.prototype, "fromAddress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address),
    __metadata("design:type", address_entity_1.Address)
], Segment.prototype, "toAddress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_entity_1.Status),
    __metadata("design:type", status_entity_1.Status)
], Segment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Segment.prototype, "departureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Segment.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Segment.prototype, "comment", void 0);
exports.Segment = Segment = __decorate([
    (0, typeorm_1.Entity)('segments')
], Segment);
//# sourceMappingURL=segment.entity.js.map