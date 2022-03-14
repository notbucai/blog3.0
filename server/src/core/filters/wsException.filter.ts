/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-03-13 22:12:26
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-14 19:03:42
 * @Description: 
 */
import { Catch, ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io'

import {
  WsExceptionFilter,
} from '@nestjs/common';
import { CustomException } from '../exception/custom.exception';
import { ErrorCode } from '../../constants/error';
import { ConfigService } from '../../config/config.service';
import { LoggerService } from '../../common/logger.service';
import { EMIT_EXCEPTION } from 'src/constants/wsEvents';

@Catch()
export class WsExceptionsFilter implements WsExceptionFilter {
  logger: LoggerService;
  constructor() {
    this.logger = new LoggerService();
  }

  catch (exception: unknown, host: ArgumentsHost) {
    const ws = host.switchToWs();
    const client: Socket = ws.getClient();
    const responseException = {
      code: ErrorCode.ERROR.CODE,
      message: ErrorCode.ERROR.MESSAGE
    };
    
    if (exception instanceof CustomException) {
      responseException.code = exception.code;
      responseException.message = exception.message;
    }
    this.logger.error({
      message: responseException.message || (exception as Error)?.message || String(exception),
      data: {
        responseException,
        exception,
        exceptionMessage: (exception as Error)?.message,
        client: client.id
      }
    });

    client.emit(EMIT_EXCEPTION, responseException);
  }
}