import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AdminExpensesService } from './admin-expenses.service';
import { AdminExpenses } from '../entities/admin-expenses.entity';
import { CreateAdminExpensesDto } from 'src/dto/create-admin-expenses.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('admin-expenses')
@Roles(Role.Admin)
export class AdminExpensesController {
  constructor(private readonly adminExpensesService: AdminExpensesService) {}
  @ApiOperation({
          summary: 'Crear un nuevo gasto administrativo',
          description: 'Permite crear un nuevo gasto administrativo. Requiere los datos del gasto administrativo (ver CreateAdminExpensesDto). Solo los administradores pueden crear usuarios.',
      })
 @Post(":user_id")
    async create(@Param('user_id') id: number,@Body() createAdminExpensesDto: CreateAdminExpensesDto): Promise<any> {
  return this.adminExpensesService.create(id, createAdminExpensesDto);
}
    @ApiOperation({
          summary: 'Obtener todos los gastos administrativos',
          description: 'Retorna un array de todos los gastos administrativos registrados en el sistema. Este endpoint es accesible solo para administradores.',
      })
  @Get()
  async findAll() {
    return this.adminExpensesService.findAll();
  }

  @ApiOperation({
      summary: 'Obtener un gasto administrativo por ID',
      description: 'Retorna un gasto administrativo específico por su ID. Si no se encuentra, retorna null. Solo los administradores pueden acceder a este endpoint.',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.adminExpensesService.findOne(Number(id));
  }
  @ApiOperation({
      summary: 'Actualizar un gasto administrativo por ID',
      description: 'Permite actualizar un gasto administrativo específico por su ID. Requiere los datos del gasto administrativo (ver CreateAdminExpensesDto). Solo los administradores pueden acceder a este endpoint.',
  })
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<AdminExpenses>) {
    return this.adminExpensesService.update(Number(id), data);
  }
  @ApiOperation({
      summary: 'Eliminar un gasto administrativo por ID',
      description: "Permite eliminar un gasto administrativo específico por su ID. Solo los administradores pueden acceder a este endpoint.",
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.adminExpensesService.remove(Number(id));
    return { message: 'Deleted successfully' };
  }
}