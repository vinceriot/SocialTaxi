"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const segments_service_1 = require("./segments.service");
const segment_entity_1 = require("./segment.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../user/user.entity");
const vehicle_entity_1 = require("../vehicles/vehicle.entity");
const address_entity_1 = require("../address/address.entity");
const status_entity_1 = require("../status/status.entity");
let SegmentsModule = class SegmentsModule {
};
exports.SegmentsModule = SegmentsModule;
exports.SegmentsModule = SegmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([segment_entity_1.Segment, order_entity_1.Order, user_entity_1.User, vehicle_entity_1.Vehicle, address_entity_1.Address, status_entity_1.Status])],
        providers: [segments_service_1.SegmentsService],
    })
], SegmentsModule);
//# sourceMappingURL=segments.module.js.map