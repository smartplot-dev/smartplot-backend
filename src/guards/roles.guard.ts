import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Role } from '../enums/role.enum';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true; // If the route is public, allow access (use @Public() decorator)
        }
        
        const can = await super.canActivate(context);
        if (!can) {
            return false;
        }
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles) {
            return true; // No roles required, allow access (but only if has JWT token)
                         // useful for endpoints that require authentication but not specific roles
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiredRoles.some(role => user.role?.includes(role));
    }
}