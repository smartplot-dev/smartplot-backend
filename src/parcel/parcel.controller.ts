import {Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,Patch } from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { CreateParcelDto } from 'src/dto/create-parcela.dto';
import { Parcel } from 'src/entities/parcel.entity';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('parcel')
@Roles(Role.Admin)
export class ParcelController {constructor(
        private readonly parcelService: ParcelService
    ) {}

    @ApiOperation({
        summary: 'Crear una nueva parcela',
        description: 'Crear una nueva parcela. Requiere los datos de la parcela (ver CreateParcelDto). Solo los administradores pueden crear parcelas.',
    })
    @Post()
    create(@Body() createParcelDto: CreateParcelDto): Promise<Parcel> {
        return this.parcelService.createParcel(createParcelDto);
    }

    @ApiOperation({
        summary: 'Obtener todas las parcelas',
        description: 'Retorna un array de todas las parcelas registradas en el sistema. Solo los administradores pueden acceder a este endpoint.',
    })
    @Get()
    getAll(): Promise<Parcel[]> {
        return this.parcelService.findAllParcels();
    }

    @ApiOperation({
        summary: 'Obtener una parcela por ID',
        description: 'Retorna una parcela específica por su ID. Si no se encuentra, retorna null. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get(':id_parcel')
    @Roles(Role.Admin, Role.ParcelOwner)
    getById(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<Parcel | null> {
        return this.parcelService.findParcelById(id_parcel);
        
    }

    @ApiOperation({
        summary: 'Obtener una parcela por su número',
        description: 'Retorna una parcela específica por su número. Si no se encuentra, retorna null. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get('number/:number')
    @Roles(Role.Admin, Role.ParcelOwner)
    getByNumber(@Param('number', ParseIntPipe) number: string): Promise<Parcel | null> {
        return this.parcelService.findParcelByNumber(number);
        
    }

    @ApiOperation({
        summary: 'Actualizar el número de una parcela',
        description: 'Actualiza el número de una parcela específica por su ID. Requiere el nuevo número de parcela. Solo los administradores pueden actualizar parcelas.',
    })
    @Patch(':id_parcel')
    async updateParcelNumber(
    @Param('id_parcel', ParseIntPipe) id_parcel: number,
    @Body('numero_parcela') numero_parcela: string,
    ): Promise<Parcel | null> {
        return this.parcelService.updateParcelNumber(id_parcel, numero_parcela);
    }

    @ApiOperation({
        summary: 'Eliminar una parcela por ID',
        description: 'Permite eliminar una parcela específica por su ID. Si no se encuentra, no realiza ninguna acción. Solo los administradores pueden eliminar parcelas.',
    })
    @Delete(':id_parcel')
    delete(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<void> {
        return this.parcelService.removeParcel(id_parcel);
    }
}
