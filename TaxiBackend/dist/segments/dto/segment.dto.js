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
exports.SegmentDto = void 0;
const class_transformer_1 = require("class-transformer");
const adress_dto_1 = require("../../address/adress.dto");
class SegmentDto {
    id;
    fromAddress;
    toAddress;
    departureTime;
    arrivalTime;
    comment;
    status;
}
exports.SegmentDto = SegmentDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SegmentDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => adress_dto_1.AddressDto),
    __metadata("design:type", adress_dto_1.AddressDto)
], SegmentDto.prototype, "fromAddress", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => adress_dto_1.AddressDto),
    __metadata("design:type", adress_dto_1.AddressDto)
], SegmentDto.prototype, "toAddress", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], SegmentDto.prototype, "departureTime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], SegmentDto.prototype, "arrivalTime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SegmentDto.prototype, "comment", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], SegmentDto.prototype, "status", void 0);
//# sourceMappingURL=segment.dto.js.map