import { Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Put,
 } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from 'src/dto/create-invoice.dto';
import { Invoice } from 'src/entities/invoice.entity';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { get } from 'http';

@Roles(Role.Admin)
@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService
    ) {}

    @Get('parcel-and-users')
    @Roles(Role.Admin, Role.ParcelOwner)
    getWithParcelAndUser(): Promise<Invoice[]> {
        return this.invoiceService.getInvoicesWithParcelsAndUsers();
    }

    @ApiOperation({
        summary: 'Crear una nota de cobro asociada a una parcela',
        description: 'Permite crear una nueva nota de cobro asociada a una parcela específica. Requiere el ID de la parcela y los detalles de la nota de cobro (ver CreateInvoiceDto). Solo los administradores pueden crear notas de cobro.',
    })
    @ApiResponse({status: 201, description: 'Nota de cobro creada exitosamente.'})
    @ApiResponse({status: 400, description: 'La parcela no existe o los datos de la nota de cobro son inválidos.'})
    @ApiResponse({status: 403, description: 'Acceso denegado. Solo los administradores pueden crear notas de cobro.'})
    @Post(':id_parcel')
    create(
        @Body() createInvoiceDto: CreateInvoiceDto,
        @Param('id_parcel', ParseIntPipe) id_parcel: number
    ): Promise<Invoice> {
        return this.invoiceService.createInvoice(createInvoiceDto, id_parcel);
    }

    @ApiOperation({
        summary: 'Obtener todas las notas de cobro',
        description: 'Retorna un array de todas las notas de cobro registradas en el sistema. Solo los administradores pueden acceder a este endpoint.',
    })
    @Get()
    @ApiResponse({status: 200, description: 'Lista de notas de cobro.'})
    @ApiResponse({status: 403, description: 'Acceso denegado. Solo los administradores pueden ver todas las notas de cobro.'})
    getAll(): Promise<Invoice[]> {
        return this.invoiceService.findAllInvoices();
    }

    @ApiOperation({
        summary: 'Obtener una nota de cobro por ID',
        description: 'Retorna una nota de cobro específica por su ID. Si no se encuentra, retorna null. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get(':id')
    @Roles(Role.Admin, Role.ParcelOwner)
    getById(@Param('id', ParseIntPipe) id: number): Promise<Invoice | null> {
        return this.invoiceService.findInvoiceById(id);
    }

    @ApiOperation({
        summary: 'Obtener notas de cobro de una parcela por ID de parcela',
        description: 'Retorna todas las notas de cobro asociadas a una parcela específica por su ID. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @ApiParam({
        name: 'id_parcel',
        description: 'ID de la parcela para la cual se desean obtener las notas de cobro.',
        type: Number,
        required: true,
    })
    @ApiResponse({status: 200, description: 'Lista de notas de cobro asociadas a la parcela. Si no hay notas, retorna un objeto JSON vacío ([]).'})
    @Get('parcel/:id_parcel')
    @Roles(Role.Admin, Role.ParcelOwner)
    getByParcelId(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<Invoice[]> {
        return this.invoiceService.findInvoicesByParcelId(id_parcel);
    }

    @ApiOperation({
        summary: 'Obtener notas de cobro de las parcelas de un usuario por ID de usuario',
        description: 'Retorna todas las notas de cobro asociadas a las parcelas de un usuario específico por su ID. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @ApiResponse({status: 200, description: 'Lista de notas de cobro asociadas a las parcelas del usuario.'})
    @ApiResponse({status: 404, description: 'Usuario no encontrado o no tiene parcelas asociadas.'})
    @Get('user/:id_user')
    @Roles(Role.Admin, Role.ParcelOwner)
    getByUserId(@Param('id_user', ParseIntPipe) id_user: number): Promise<Invoice[]> {
        return this.invoiceService.findInvoicesByUser(id_user);
    }

    @ApiOperation({
        summary: 'Eliminar una nota de cobro por ID',
        description: 'Permite eliminar una nota de cobro específica por su ID. Si no se encuentra, no realiza ninguna acción. Solo los administradores pueden eliminar notas de cobro.',
    })
    @ApiResponse({status: 200, description: 'Nota de cobro eliminada exitosamente.'})
    @ApiResponse({status: 400, description: 'Nota de cobro no existe.'})
    @ApiResponse({status: 403, description: 'Acceso denegado. Solo los administradores pueden eliminar notas de cobro.'})
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.invoiceService.deleteInvoice(id);
    }

    @ApiOperation({
        summary: 'Actualizar una nota de cobro por ID',
        description: 'Permite actualizar los detalles de una nota de cobro específica por su ID. Requiere los nuevos datos en el cuerpo de la solicitud (ver CreateInvoiceDto). No es necesario enviar todos los campos, solo los que se desean actualizar. Solo los administradores pueden actualizar notas de cobro.',
    })
    @ApiResponse({status: 200, description: 'Nota de cobro actualizada exitosamente.'})
    @ApiResponse({status: 400, description: 'Nota de cobro no existe o los datos son inválidos.'})
    @ApiResponse({status: 403, description: 'Acceso denegado. Solo los administradores pueden actualizar notas de cobro.'})
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<CreateInvoiceDto>
    ): Promise<Invoice> {
        return this.invoiceService.updateInvoice(id, updateData);
    }
}
