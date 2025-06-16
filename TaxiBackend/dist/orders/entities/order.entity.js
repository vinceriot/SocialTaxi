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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/user.entity");
const status_entity_1 = require("../../status/status.entity");
const trip_purpose_entity_1 = require("../../purposes/trip-purpose.entity");
const order_preferences_entity_1 = require("../../preferences/order-preferences.entity");
const segment_entity_1 = require("../../segments/segment.entity");
let Order = class Order {
    id;
    user;
    dispatcher;
    status;
    comment;
    createdAt;
    updatedAt;
    purpose;
    vehicleType;
    preferences;
    segments;
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "dispatcher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_entity_1.Status),
    __metadata("design:type", status_entity_1.Status)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Order.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trip_purpose_entity_1.TripPurpose),
    __metadata("design:type", trip_purpose_entity_1.TripPurpose)
], Order.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_preferences_entity_1.OrderPreference, (pref) => pref.order),
    __metadata("design:type", Array)
], Order.prototype, "preferences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => segment_entity_1.Segment, segment => segment.order),
    __metadata("design:type", Array)
], Order.prototype, "segments", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map