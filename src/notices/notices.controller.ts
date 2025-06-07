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
    UploadedFile,
    UseInterceptors,
    Res,
    NotFoundException,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from 'src/dto/create-notice.dto';
import { Notice } from 'src/entities/notice.entity';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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
    create(@Body() createNoticeDto: CreateNoticeDto, @Request() req): Promise<number> {
        const userId = req.user.id; // assuming user ID is stored in the request object
        return this.noticesService.createNotice(createNoticeDto, userId);
    }

    @ApiOperation({
        summary: 'Obtener todos los avisos',
        description: 'Retorna un array de todos los avisos registrados en el sistema. Solo administradores pueden acceder a este endpoint.',
    })
    @Get()
    @Roles(Role.Admin)
    getAll(): Promise<Notice[]> {
        return this.noticesService.findAllNotices();
    }

    @ApiOperation({
        summary: 'Obtener todos los avisos visibles para propietarios de parcelas',
        description: 'Retorna un array de todos los avisos que son visibles para los propietarios de parcelas. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get('visible')
    @Roles(Role.Admin, Role.ParcelOwner)
    getAllVisible(): Promise<Notice[]> {
        return this.noticesService.findAllVisibleNotices();
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

    @Post(':id/upload-file')
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 25 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Solo se permiten archivos PDF'), false);
            }
            cb(null, true);
        },
    }))
    async uploadNoticeFile(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.noticesService.uploadNoticeFile(id, file);
    }
    @Get(':id/download-file')
    async downloadNoticeFile(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response
    ) {
        const notice = await this.noticesService.findNoticeById(id);
        if (!notice || !notice.file_path) {
            throw new NotFoundException('Archivo no encontrado');
        }
        return res.download(notice.file_path);
    }
}
