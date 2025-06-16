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
exports.OrderDetailResponseDto = void 0;
const class_transformer_1 = require("class-transformer");
const segment_dto_1 = require("../../segments/dto/segment.dto");
const response_vehicle_dto_1 = require("../../vehicles/dto/response-vehicle.dto");
const driver_dto_1 = require("../../user/dto/driver.dto");
class OrderDetailResponseDto {
    id;
    comment;
    createdAt;
    updatedAt;
    status;
    segments;
    returnTime;
    vehicle;
    user;
}
exports.OrderDetailResponseDto = OrderDetailResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], OrderDetailResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], OrderDetailResponseDto.prototype, "comment", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], OrderDetailResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], OrderDetailResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], OrderDetailResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => segment_dto_1.SegmentDto),
    __metadata("design:type", Array)
], OrderDetailResponseDto.prototype, "segments", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], OrderDetailResponseDto.prototype, "returnTime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => response_vehicle_dto_1.VehicleDto),
    __metadata("design:type", response_vehicle_dto_1.VehicleDto)
], OrderDetailResponseDto.prototype, "vehicle", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => driver_dto_1.DriverDto),
    __metadata("design:type", driver_dto_1.DriverDto)
], OrderDetailResponseDto.prototype, "user", void 0);
//# sourceMappingURL=response-id-order.dto.js.map