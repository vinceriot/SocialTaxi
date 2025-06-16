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
exports.UserPreferencesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_preferences_service_1 = require("./user-preferences.service");
let UserPreferencesController = class UserPreferencesController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll(req) {
        return this.service.getAllForUser(req.user.id);
    }
    delete(preferenceId, req) {
        return this.service.deletePreference(req.user.id, preferenceId);
    }
    async set(req, body) {
        console.log('Incoming body:', body);
        await this.service.setPreferences(req.user.id, body.preferenceIds);
        return { message: 'Предпочтения обновлены' };
    }
};
exports.UserPreferencesController = UserPreferencesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Delete)(':preferenceId'),
    __param(0, (0, common_1.Param)('preferenceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserPreferencesController.prototype, "set", null);
exports.UserPreferencesController = UserPreferencesController = __decorate([
    (0, common_1.Controller)('user-preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_preferences_service_1.UserPreferencesService])
], UserPreferencesController);
//# sourceMappingURL=user-preferences.controller.js.map