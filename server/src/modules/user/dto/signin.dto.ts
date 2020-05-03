import {
    IsString,
    Length,
    IsNotEmpty,
    IsEnum,
    IsEmpty,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '../../../constants/error';
import { UserConstants } from '../../../constants/constants';

export enum SingInType {
    code = 1,
    pass = 2
}

export class SignInDto {

    @MinLength(1, {
        message: '手机号码/邮箱地址或用户名不正确',
    })
    @IsString()
    @ApiProperty({ description: '登录账号', example: "13767284559" })
    readonly login: string;
    
    @Length(UserConstants.PASSWORD_MIN_LENGTH, UserConstants.PASSWORD_MAX_LENGTH, {
        message: ErrorCode.InvalidPassword.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidPassword.CODE,
        },
    })
    @IsString({
        message: ErrorCode.InvalidPassword.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidPassword.CODE,
        },
    })
    @ApiProperty({ description: '密码', example: '123456' })
    readonly pass: string;

}