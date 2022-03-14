import { HttpStatus, HttpException } from '@nestjs/common';
import { ErrorCode } from '../../constants/error';

class MyHttpExceptionData {
    code?: number;
    message?: string;
}

export class MyHttpException extends HttpException {
    constructor(expData: MyHttpExceptionData) {
        if (typeof expData.code === 'undefined') {
            expData.code = ErrorCode.ParamsError.CODE;
        }
        // this.getResponse()
        super(expData, HttpStatus.OK);
    }
}