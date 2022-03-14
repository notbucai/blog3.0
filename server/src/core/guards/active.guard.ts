import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, ContextType } from '@nestjs/common';
import { User, UserStatus } from '../../models/user.entity';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../exception/http.exception';
import { LoggerService } from '../../common/logger.service';
import { CustomException } from '../exception/custom.exception';
import { Server, Socket } from 'socket.io';

@Injectable()
export class ActiveGuard implements CanActivate {
    constructor(
        private readonly logger: LoggerService,
    ) { }

    canActivate (context: ExecutionContext): boolean {
        // type 
        const type = context.getType();
        const handle = type === 'http' ? context.switchToHttp().getRequest() : type === 'ws' ? context.switchToWs().getClient() : context.switchToRpc().getContext();
        const Exception = type === 'http' ? MyHttpException : CustomException;
        this.logger.info({
            data: {
                codeline: 'active.guard canActivate',
                ip: handle.clientIp,
                timeLabel: new Date().toLocaleDateString(),
            }
        });
        let user = handle.user as User;
        if( type === 'ws'){
            user = handle.data?.user;
        }

        if (!user) {
            throw new Exception({
                code: ErrorCode.LoginTimeout.CODE,
            });
        }
        if (user.status === UserStatus.Actived) {
            return true;
        }
        throw new Exception({
            code: ErrorCode.Frozen.CODE,
        });
    }
}
