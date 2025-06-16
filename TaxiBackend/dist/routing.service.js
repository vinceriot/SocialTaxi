"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let RoutingService = class RoutingService {
    ORS_API_KEY = process.env.ORS_API_KEY;
    BASE_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';
    async getDistanceInMeters(start, end) {
        const url = `${this.BASE_URL}?api_key=${this.ORS_API_KEY}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;
        const response = await axios_1.default.get(url);
        const distance = response.data?.features?.[0]?.properties?.segments?.[0]?.distance;
        if (!distance)
            throw new Error('Не удалось получить расстояние');
        return distance;
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)()
], RoutingService);
//# sourceMappingURL=routing.service.js.map