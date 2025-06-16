"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_preferences_entity_1 = require("./user-preferences.entity");
const preferences_entity_1 = require("../preferences/preferences.entity");
const user_entity_1 = require("../user/user.entity");
const user_preferences_service_1 = require("./user-preferences.service");
const user_preferences_controller_1 = require("./user-preferences.controller");
let UserPreferencesModule = class UserPreferencesModule {
};
exports.UserPreferencesModule = UserPreferencesModule;
exports.UserPreferencesModule = UserPreferencesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_preferences_entity_1.UserPreference, preferences_entity_1.Preference, user_entity_1.User])],
        providers: [user_preferences_service_1.UserPreferencesService],
        controllers: [user_preferences_controller_1.UserPreferencesController],
    })
], UserPreferencesModule);
//# sourceMappingURL=user-preferences.module.js.map