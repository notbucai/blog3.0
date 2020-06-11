/*
 * @Author: bucai
 * @Date: 2020-06-03 11:34:32
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-03 13:33:00
 * @Description: 
 */
import { MinLength, IsString, Length, IsMobilePhone } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserConstants } from "../../../constants/constants";
import { ErrorCode } from "../../../constants/error";

export class BindPhone {
  @IsMobilePhone('zh-CN', {
    message: ErrorCode.InvalidPhone.MESSAGE,
    context: {
      errorCode: ErrorCode.InvalidPhone.CODE,
    },
  })
  @ApiProperty({ description: '手机号', example: '13767284559' })
  readonly phone: string;

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

export class UnbindPhone{
  @IsMobilePhone('zh-CN', {
    message: ErrorCode.InvalidPhone.MESSAGE,
    context: {
      errorCode: ErrorCode.InvalidPhone.CODE,
    },
  })
  @ApiProperty({ description: '手机号', example: '13767284559' })
  readonly phone: string;
}