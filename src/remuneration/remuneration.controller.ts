import { Body, Controller, Delete, Get,Res, Param, Post,Put, UploadedFile,UseInterceptors,Request, ParseIntPipe,UnauthorizedException, NotFoundException } from '@nestjs/common';
import { RemunerationService } from './remuneration.service';
import { CreateRemunerationDto } from 'src/dto/create-remuneration.dto';
import { Remuneration } from 'src/entities/remuneration.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('remuneration')
@Roles(Role.Admin)
export class RemunerationController {
    constructor(
        private readonly remunerationService: RemunerationService
    ) {}

    @ApiOperation({
        summary: 'Crear una nueva remuneración',
        description: 'Permite crear una nueva remuneración en el sistema. Requiere los datos de la remuneración (ver CreateRemunerationDto). Solo los administradores pueden crear remuneraciones.',
    })
    @ApiResponse({ status: 201, description: 'Remuneración creada exitosamente.', type: Remuneration,})
    @ApiResponse({ status: 400, description: 'Bad Request. Asegúrate de enviar todos los campos requeridos.',})
    @ApiResponse({ status: 403, description: 'El usuario no tiene permisos para crear remuneraciones.',})
    @Post()
    create(@Body() createRemunerationDto: CreateRemunerationDto, @Request() req): Promise<number> {
        const user_id = req.user.sub;
        return this.remunerationService.createRemuneration(createRemunerationDto, user_id);
    }

    @ApiOperation({
        summary: 'Obtener todas las remuneraciones',
        description: 'Retorna un array de todas las remuneraciones registradas en el sistema. Este endpoint es accesible solo para administradores.',
    })
    @Get()
    getAll(): Promise<Remuneration[]> {
        return this.remunerationService.getAllRemunerations();
    }

    @ApiOperation({
        summary: 'Obtener una remuneración por ID',
        description: 'Permite obtener una remuneración específica por su ID. Solo los administradores pueden acceder a esta información.',
    })
    @Get(':id')
    getById(@Param('id') id: number): Promise<Remuneration> {
        return this.remunerationService.getRemunerationById(id);
    }

    @ApiOperation({
        summary: 'Obtener remuneraciones por RUT del empleado',
        description: 'Permite obtener todas las remuneraciones asociadas a un empleado específico utilizando su RUT (formato: 12345678-5). Este endpoint es útil para consultar las remuneraciones de un empleado en particular.',
    })
    @Get('employee/:rut')
    getByEmployeeRut(@Param('rut') rut: string): Promise<Remuneration[]> {
        return this.remunerationService.getRemunerationsByEmployeeRut(rut);
    }

    @ApiOperation({
        summary: 'Obtener remuneraciones por año',
        description: 'Permite obtener todas las remuneraciones registradas en un año determinado.',
    })
    @Get('year/:year')
    getByYear(@Param('year') year: number): Promise<Remuneration[]> {
        return this.remunerationService.getRemunerationsByYear(year);
    }

    @ApiOperation({
        summary: 'Obtener remuneraciones por mes y año',
        description: 'Permite obtener todas las remuneraciones registradas en un mes y año específicos.',
    })
    @Get('year/:year/month/:month')
    getByYearAndMonth(@Param('year') year: number, @Param('month') month: string): Promise<Remuneration[]> {
        return this.remunerationService.getRemunerationsByMonthAndYear(month, year);
    }

    @ApiOperation({
        summary: 'Obtener remuneraciones por nombre y apellido del empleado',
        description: 'Permite obtener todas las remuneraciones asociadas a un empleado específico utilizando su nombre y apellido paterno.',
    })
    @Get('employee/name/:name/surname/:surname')
    getByEmployeeNameAndSurname(
        @Param('name') name: string,
        @Param('surname') surname: string
    ): Promise<Remuneration[]> {
        return this.remunerationService.getRemunerationsByEmployeeNameAndSurname(name, surname);
    }

    @ApiOperation({
        summary: 'Actualizar una remuneración',
        description: 'Permite actualizar los datos de una remuneración existente. Solo los administradores pueden realizar esta acción.',
    })
    @Put(':id')
    update(@Param('id') id: number, @Body() updateRemunerationDto: Partial<CreateRemunerationDto>): Promise<Remuneration> {
        return this.remunerationService.updateRemuneration(id, updateRemunerationDto);
    }

    @ApiOperation({
        summary: 'Eliminar una remuneración',
        description: 'Permite eliminar una remuneración específica por su ID. Solo los administradores pueden realizar esta acción.',
    })
    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.remunerationService.deleteRemuneration(id);
    }

    @Post(':id/upload-file')
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 25 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(new Error('Tipo de archivo no permitido'), false);
            }
            cb(null, true);
        },
    }))
    async uploadRemunerationFile(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.remunerationService.uploadRemunerationFile(id, file);
    }

    @Get(':id/download-file')
    async downloadRemunerationFile(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response
    ) {
        const remuneration = await this.remunerationService.getRemunerationById(id);
        if (!remuneration || !remuneration.file_path) {
            throw new NotFoundException('Archivo no encontrado');
        }
        return res.download(remuneration.file_path);
    }
}
