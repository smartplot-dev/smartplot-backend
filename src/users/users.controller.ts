import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Put,
    Patch,
    Request,
    UnauthorizedException,
    NotFoundException,
    BadRequestException
 } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Public } from 'src/decorators/public.decorator'
import { canViewUser, canViewUserRut } from 'src/auth/policies/user.policy';

@Controller('users')
@Roles(Role.Admin)
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @ApiOperation({
        summary: 'Crear un nuevo usuario',
        description: 'Permite crear un nuevo usuario en el sistema. Requiere los datos del usuario (ver CreateUserDto). Solo los administradores pueden crear usuarios.',
    })
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }

    @ApiOperation({
        summary: 'Obtener todos los usuarios',
        description: 'Retorna un array de todos los usuarios registrados en el sistema. Este endpoint es accesible solo para administradores.',
    })
    @Get()
    getAll(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }

    @ApiOperation({
        summary: 'Obtener un usuario por ID',
        description: 'Retorna un usuario específico por su ID. Si no se encuentra, retorna null. Administradores y propietarios de parcelas pueden acceder a este endpoint.',
    })
    @Get(':id')
    @Roles(Role.Admin, Role.ParcelOwner)
    async getById(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<User | null> {
        // Check if the user has permission to view this user
        if (!id || isNaN(id)) {
            throw new BadRequestException('User ID is required.');
        }
        const requestingUser = await this.usersService.findUserById(req.user.sub);
        if (!requestingUser) {
            throw new NotFoundException('User not found.');
        }
        if (!canViewUser({ id: requestingUser.id, role: requestingUser.role }, id)) {
            console.log(`User with ID ${requestingUser.id} attempted to access user with ID ${id} without permission.`);
            throw new UnauthorizedException('Access denied: You do not have permission to view this user.');
        }
        console.log(`User with ID ${requestingUser.id} and role ${requestingUser.role} accessed user with ID ${id}.`);
        return this.usersService.findUserById(id);
    }

    @ApiOperation({
        summary: 'Obtener un usuario por RUT',
        description: 'Retorna un usuario específico por su RUT. Si no se encuentra, retorna null. Este endpoint es accesible para administradores y propietarios de parcelas.',
    })
    @Get('rut/:rut')
    @Roles(Role.Admin, Role.ParcelOwner)
    getByRut(@Param('rut') rut: string, @Request() req): Promise<User | null> {
        // Check if the user has permission to view this user by RUT
        const requestingUser = req.user;
        console.log(`Requesting user RUT: ${requestingUser.rut}, role: ${requestingUser.role}`);
        if (!canViewUserRut({ rut: requestingUser.rut, role: requestingUser.role }, rut)) {
            throw new UnauthorizedException('Access denied: You do not have permission to view this user.');
        }
        return this.usersService.findUserByRut(rut);
    }

    @ApiOperation({
        summary: 'Actualizar un usuario por ID',
        description: 'Permite actualizar los datos de un usuario específico por su ID. Requiere los nuevos datos del usuario (ver UpdateUserDto). Este endpoint es accesible para administradores y propietarios de parcelas.',
    })
    @Put(':id')
    @Roles(Role.Admin, Role.ParcelOwner)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Request() req): Promise<User | null> {
        // Check if the user has permission to update this user
        const requestingUser = req.user;
        if (!canViewUser({ id: requestingUser.sub, role: requestingUser.role }, id)) {
            throw new UnauthorizedException('Access denied: You do not have permission to update this user.');
        }
        return this.usersService.updateUser(id, updateUserDto);
    }

    @ApiOperation({
        summary: 'Eliminar un usuario por ID',
        description: 'Permite eliminar un usuario específico por su ID. Si el usuario no existe, no realiza ninguna acción. Este endpoint es accesible solo para administradores.',
    })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.removeUser(id);
    }

   @ApiOperation({
        summary: 'Actualizar los parcel_ids de un usuario',
        description: 'Permite actualizar los parcel_ids asociados a un usuario específico por su ID. Requiere un array de parcel_ids en el cuerpo de la solicitud. Este endpoint es accesible solo para administradores.',
    })
    @Patch(':id/parcel_id')
    async updateUserParcels(@Param('id', ParseIntPipe) id: number,
                            @Body('parcel_ids') parcelIds: number[]): Promise<User> {
        return this.usersService.updateUserParcels(id, parcelIds);
    }

    @ApiOperation({
        summary: 'Eliminar parcela asociada a un usuario',
        description: 'Permite eliminar una parcela específica asociada a un usuario por su ID. Requiere el ID del usuario y el ID de la parcela a eliminar. Este endpoint es accesible solo para administradores.',
    })
    @Delete(':userId/parcel/:parcelId')
    async removeParcelFromUser(@Param('userId', ParseIntPipe) userId: number,
                                @Param('parcelId', ParseIntPipe) parcelId: number,
                                ): Promise<User> {
        return this.usersService.removeParcelFromUser(userId, parcelId);
    }
    
    @ApiOperation({
        summary: 'Agregar parcela a un usuario',
        description: 'Permite agregar una parcela específica a un usuario por su ID. Requiere el ID del usuario y el ID de la parcela a agregar. Este endpoint es accesible solo para administradores.',
    })
    @Patch(':userId/add-parcel/:parcelId')
    async addParcelToUser(
            @Param('userId', ParseIntPipe) userId: number,
            @Param('parcelId', ParseIntPipe) parcelId: number,
        ): Promise<User> {
        return this.usersService.addParcelToUser(userId, parcelId);
    }

    
}
