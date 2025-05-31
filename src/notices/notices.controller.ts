import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Param,
    ParseIntPipe,
    Request,
    Put,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from 'src/dto/create-notice.dto';
import { Notice } from 'src/entities/notice.entity';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('notices')
@Roles(Role.Admin)
export class NoticesController {
    constructor(
        private readonly noticesService: NoticesService,
    ) {}

    @ApiOperation({
        summary: 'Crear un nuevo aviso',
        description: 'Permite crear un nuevo aviso en el sistema. Requiere los datos del aviso (ver CreateNoticeDto). Solo los administradores pueden crear avisos.',
    })
    @Post()
    create(@Body() createNoticeDto: CreateNoticeDto, @Request() req): Promise<Notice> {
        const userId = req.user.id; // assuming user ID is stored in the request object
        return this.noticesService.createNotice(createNoticeDto, userId);
    }

    @ApiOperation({
        summary: 'Obtener todos los avisos',
        description: 'Retorna un array de todos los avisos registrados en el sistema. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get()
    @Roles(Role.Admin, Role.ParcelOwner)
    getAll(): Promise<Notice[]> {
        return this.noticesService.findAllNotices();
    }

    @ApiOperation({
        summary: 'Obtener un aviso por ID',
        description: 'Retorna un aviso específico por su ID. Si no se encuentra, retorna null. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get(':id')
    @Roles(Role.Admin, Role.ParcelOwner)
    getById(@Param('id', ParseIntPipe) id: number): Promise<Notice | null> {
        return this.noticesService.findNoticeById(id);
    }

    @ApiOperation({
        summary: 'Eliminar un aviso por ID',
        description: 'Permite eliminar un aviso específico por su ID. Si no se encuentra, no realiza ninguna acción. Solo los administradores pueden eliminar avisos.',
    })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.noticesService.deleteNotice(id);
    }

    @ApiOperation({
        summary: 'Actualizar un aviso por ID',
        description: 'Permite actualizar los datos de un aviso específico por su ID. Requiere los nuevos datos del aviso (ver CreateNoticeDto). Solo los administradores pueden actualizar avisos.',
    })
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNoticeDto: CreateNoticeDto,
    ): Promise<Notice | null> {
        return this.noticesService.updateNotice(id, updateNoticeDto);
    }
}
