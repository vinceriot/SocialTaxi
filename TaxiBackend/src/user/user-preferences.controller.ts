import { Controller, Get, Delete, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPreferencesService } from './user-preferences.service';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly service: UserPreferencesService) {}

    @Get()
    getAll(@Req() req) {
    return this.service.getAllForUser(req.user.id);
    }

    @Delete(':preferenceId')
    delete(@Param('preferenceId') preferenceId: number, @Req() req) {
    return this.service.deletePreference(req.user.id, preferenceId);
    }

    @Post()
    async set(@Req() req, @Body() body: { preferenceIds: number[] }) {
      console.log('Incoming body:', body);
      await this.service.setPreferences(req.user.id, body.preferenceIds);
      return { message: 'Предпочтения обновлены' };
    }
}