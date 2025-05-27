import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(AuthGuard('local'))
    @UseGuards(LocalStrategy)
    @Post('login')
    login(@Request() req, @Body() body: { rut: string; password: string }) {
        return this.authService.login(req.user);
    }
}
