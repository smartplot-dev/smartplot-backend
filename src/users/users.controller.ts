import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
 } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Usuario } from 'src/entities/usuario.entity';


@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<Usuario> {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    getAll(): Promise<Usuario[]> {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Usuario | null> {
        return this.usersService.findUserById(id);
    }

    @Get('rut/:rut')
    getByRut(@Param('rut') rut: string): Promise<Usuario | null> {
        return this.usersService.findUserByRut(rut);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.removeUser(id);
    }
}
