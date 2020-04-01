import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../models/user.entity';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../exception/my-http.exception';
import { Role } from '../../models/role.entity';
import { Acl } from '../../models/acl.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const _role = this.reflector.get<any>('roles', context.getHandler());
        if (!_role || !_role.name) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user as any;

        // if (user && user.isAdmin) {
        //     return true;
        // }
        // 强制要求admin
        if (_role.isAdmin) {
            return user.isAdmin;
        }

        console.log(user.role.acls, _role.name);

        if (user.role && user.role.acls) {
            const hasRoleFn = (acl: Acl) => acl.name == _role.name;
            const hasRole = user.role.acls.find(hasRoleFn);
            if (user && hasRole) {
                return true;
            }
        }

        throw new MyHttpException({
            code: ErrorCode.Forbidden.CODE,
        });
    }
}
