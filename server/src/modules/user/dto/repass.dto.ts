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

export class RepassDto {

    @MinLength(1, {
        message: '手机号码/邮箱地址不正确',
    })
    @IsString()
    @ApiProperty({ description: '手机号/邮箱', example: "13767284559" })
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

    @Length(UserConstants.CAPTCHA_LENGTH, UserConstants.CAPTCHA_LENGTH, {
        message: ErrorCode.InvalidCaptcha.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidCaptcha.CODE,
        },
    })
    @IsString({
        message: ErrorCode.InvalidCaptcha.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidCaptcha.CODE,
        },
    })
    @ApiProperty({ description: '验证码', example: '888888' })
    readonly code: string;

}