//src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { SegmentsModule } from './segments/segments.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { UserAddressModule } from './address/user-address.module';
import { UserPreferencesModule } from './user/user-preferences.module';
import { ChatModule } from './chat/chat.module'; 


import { ChatGateway } from './gateways/chat.gateway';
import { OrderGateway } from './gateways/order.gateway';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    OrdersModule,
    SegmentsModule,
    VehiclesModule,
    UserAddressModule,
    UserPreferencesModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, OrderGateway],
})
export class AppModule {}