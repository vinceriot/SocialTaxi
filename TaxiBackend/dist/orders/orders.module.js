"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const axios_1 = require("@nestjs/axios");
const user_entity_1 = require("../user/user.entity");
const status_entity_1 = require("../status/status.entity");
const order_preferences_entity_1 = require("../preferences/order-preferences.entity");
const address_entity_1 = require("../address/address.entity");
const segment_entity_1 = require("../segments/segment.entity");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                status_entity_1.Status,
                order_preferences_entity_1.OrderPreference,
                address_entity_1.Address,
                segment_entity_1.Segment,
                user_entity_1.User,
            ]),
            axios_1.HttpModule,
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map