import { Controller, UseGuards, Get } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('mail')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class MailController {
    constructor(
    ) {}

}
