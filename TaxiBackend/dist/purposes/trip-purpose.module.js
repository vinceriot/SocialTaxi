"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripPurposeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trip_purpose_entity_1 = require("./trip-purpose.entity");
const trip_purpose_service_1 = require("./trip-purpose.service");
const trip_purpose_controller_1 = require("./trip-purpose.controller");
let TripPurposeModule = class TripPurposeModule {
};
exports.TripPurposeModule = TripPurposeModule;
exports.TripPurposeModule = TripPurposeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([trip_purpose_entity_1.TripPurpose])],
        providers: [trip_purpose_service_1.TripPurposeService],
        controllers: [trip_purpose_controller_1.TripPurposeController],
        exports: [trip_purpose_service_1.TripPurposeService],
    })
], TripPurposeModule);
//# sourceMappingURL=trip-purpose.module.js.map