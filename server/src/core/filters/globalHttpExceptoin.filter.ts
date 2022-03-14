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
import { MyHttpException } from '../exception/http.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) { }

    catch (exception: any, host: ArgumentsHost) {
        console.log('------------------');
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        
        let message: string;
        let code: number;

        if (exception.code === 'EBADCSRFTOKEN') {
            response.status(HttpStatus.FORBIDDEN).json({
                code: ErrorCode.Forbidden.CODE,
                message: 'invalid csrf token',
            });
            return;
        } else if (exception instanceof HttpException) { // http exception
            const httpException: HttpException = exception;
            const exceptionMessage = httpException.getResponse() as { code?: number; message?: string; };

            if (exceptionMessage && typeof exceptionMessage.code !== 'undefined') {
                code = exceptionMessage.code;
                message = exceptionMessage.message || ErrorCode.CodeToMessage(code);
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
        this.logger.error({
            message: message,
            data: exception
        });
        response.status(HttpStatus.OK).json({
            code,
            message,
            data: this.configService.env === this.configService.DEVELOPMENT ? {
                nestjs: exception,
            } : null,
        });
    }
}