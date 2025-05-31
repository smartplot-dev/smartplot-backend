import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './enums/role.enum';
import { Public } from './decorators/public.decorator';

@Controller()
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('po_test')
  @Roles(Role.ParcelOwner)
  getPoTest(): string {
    return 'This is a test endpoint for Parcel Owners';
  }
}
