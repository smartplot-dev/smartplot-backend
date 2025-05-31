import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(AuthGuard('local'))
    @UseGuards(LocalStrategy)
    @Post('login')
    @ApiOperation({
        summary: 'Inicio de sesión con RUT y contraseña',
        description: 'Autenticar usuario con RUT y contraseña, retornando un token JWT que permite acceder al resto de la API.',
    })
    login(@Request() req, @Body() body: { rut: string; password: string }) {
        return this.authService.login(req.user);
    }
}
