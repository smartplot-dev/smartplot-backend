import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async validateUser(rut: string, password: string): Promise<User | null> {
        const user = await this.usersService.findUserByRut(rut);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new BadRequestException('Invalid password');
        }
        return user;
    }

    async login(user: User): Promise<{ access_token: string, mustChangePassword?: boolean }> {
        const payload = { rut: user.rut, sub: user.id, role: user.role }; // 'sub' is a common convention for the user ID in JWT payloads
        const accessToken = this.jwtService.sign(payload);
        if (user.mustChangePassword) {
            return { access_token: accessToken, mustChangePassword: true };
        }
        return { access_token: accessToken };
    }

}
