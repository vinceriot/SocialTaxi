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
exports.UserPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_preferences_entity_1 = require("./user-preferences.entity");
const user_entity_1 = require("./user.entity");
const preferences_entity_1 = require("../preferences/preferences.entity");
let UserPreferencesService = class UserPreferencesService {
    userPreferenceRepo;
    preferenceRepo;
    userRepo;
    constructor(userPreferenceRepo, preferenceRepo, userRepo) {
        this.userPreferenceRepo = userPreferenceRepo;
        this.preferenceRepo = preferenceRepo;
        this.userRepo = userRepo;
    }
    async getAllForUser(userId) {
        return this.userPreferenceRepo.find({
            where: { user: { id: userId } },
            relations: ['preference'],
        });
    }
    async deletePreference(userId, preferenceId) {
        return this.userPreferenceRepo.delete({
            user: { id: userId },
            preference: { id: preferenceId },
        });
    }
    async setPreferences(userId, preferenceIds) {
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        await this.userPreferenceRepo.delete({ user: { id: userId } });
        const preferences = await this.preferenceRepo.findByIds(preferenceIds);
        const entries = preferences.map(pref => this.userPreferenceRepo.create({ user, preference: pref }));
        return this.userPreferenceRepo.save(entries);
    }
};
exports.UserPreferencesService = UserPreferencesService;
exports.UserPreferencesService = UserPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_preferences_entity_1.UserPreference)),
    __param(1, (0, typeorm_1.InjectRepository)(preferences_entity_1.Preference)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserPreferencesService);
//# sourceMappingURL=user-preferences.service.js.map