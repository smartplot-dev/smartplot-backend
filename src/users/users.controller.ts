import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Put,
 } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dto/update-user.dto';


@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    getAll(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
        return this.usersService.findUserById(id);
    }

    @Get('rut/:rut')
    getByRut(@Param('rut') rut: string): Promise<User | null> {
        return this.usersService.findUserByRut(rut);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.removeUser(id);
    }
}
