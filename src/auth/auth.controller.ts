import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(AuthGuard('local'))
    @UseGuards(LocalStrategy)
    @Post('login')
    @ApiOperation({
        summary: 'Inicio de sesión con RUT y contraseña',
        description: 'Autenticar usuario con RUT y contraseña, retornando un token JWT que permite acceder al resto de la API. Por razones obvias, este endpoint es público y no requiere autenticación previa.',
    })
    @ApiResponse({ status: 201, description: 'Inicio de sesión exitoso. Retorna un token JWT.' })
    @ApiResponse({ status: 400, description: 'RUT o contraseña inválidos/no existen.' })
    @ApiResponse({ status: 401, description: 'No se presentaron credenciales (request vacío)' })
    login(@Request() req, @Body() body: { rut: string; password: string }) {
        return this.authService.login(req.user);
    }
}
