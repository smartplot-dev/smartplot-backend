import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MeterModule } from './meter/meter/meter.module';
import { ParcelModule } from './parcel/parcel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { NoticesModule } from './notices/notices.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentsModule } from './payments/payments.module';
import { MeterReadingModule } from './meterReading/meter-reading/meter-reading.module';
import { AdminExpensesModule } from './admin-expenses/admin-expenses.module';
import { RemunerationModule } from './remuneration/remuneration.module';
import { Reflector } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'smartplot',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true, // set to false in production!
      logging: false, // enable logging for debugging
      autoLoadEntities: true,
    }),
    UsersModule,
    ParcelModule,
    AuthModule,
    NoticesModule,
    InvoiceModule,
    PaymentsModule,
    MeterModule,
    MeterReadingModule,
    AdminExpensesModule,
    RemunerationModule,
    MailModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new RolesGuard(reflector), // use the RolesGuard globally, use public decorator to override it
      inject: [Reflector],
    },
    JwtStrategy,
  ],
})
export class AppModule {}
