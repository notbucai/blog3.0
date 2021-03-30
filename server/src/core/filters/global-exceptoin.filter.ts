import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { LoggerService } from '../../common/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) { }

    catch (exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        // const request = ctx.getRequest();
        const response = ctx.getResponse();
        const nestjsMessage = exception.message;
        let message;
        let code: number;

        if (exception.code === 'EBADCSRFTOKEN') {
            response.status(HttpStatus.FORBIDDEN).json({
                code: ErrorCode.Forbidden.CODE,
                message: 'invalid csrf token',
            });
            return;
        } else if (exception.getStatus) { // http exception
            const httpException: HttpException = exception as HttpException;
            if (httpException.message && typeof httpException.message.code !== 'undefined') {
                code = httpException.message.code;
                message = httpException.message.message || ErrorCode.CodeToMessage(code);
            } else {
                const statusCode = httpException.getStatus();
                if (ErrorCode.HasCode(statusCode)) {
                    code = statusCode;
                    message = ErrorCode.CodeToMessage(statusCode);
                } else {
                    code = ErrorCode.ERROR.CODE;
                    message = ErrorCode.ERROR.MESSAGE;
                }
            }
        } else {
            // 报错抛出的Error
            code = ErrorCode.ERROR.CODE;
            message = ErrorCode.ERROR.MESSAGE;
            this.logger.error({
                message: [exception.message, exception.stack].join('\n'),
                data: exception
            });
        }
        // NOTE: 权限不足跳转由前端判定
        // const apiPrefix = this.configService.server.apiPrefix;
        // if (code === ErrorCode.LoginTimeout.CODE && request.originalUrl.indexOf(apiPrefix) !== 0) {
        //     const redirectURL = encodeURIComponent(request.originalUrl);
        //     let url = '/signin';
        //     if (redirectURL) {
        //         url = `${url}?miliref=${redirectURL}`;
        //     }
        //     response.redirect(url);
        //     return;
        // }
        response.status(HttpStatus.OK).json({
            code,
            message,
            data: this.configService.env === this.configService.DEVELOPMENT ? {
                nestjs: nestjsMessage,
            } : null,
        });
    }
}