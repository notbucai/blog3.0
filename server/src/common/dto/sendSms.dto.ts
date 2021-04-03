/*
 * @Author: bucai
 * @Date: 2021-04-02 00:04:51
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-03 20:27:28
 * @Description:
 */
import {
  IsMobilePhone,
  IsObject
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../constants/error';

export type CaptchaType = {
  ticket: string;
  randstr: string;
}

export class SendSmsDto {

  @ApiProperty({ description: '手机号', example: "13767284559", required: true })
  @IsMobilePhone('zh-CN', {
    message: ErrorCode.InvalidPhone.MESSAGE,
    context: {
      errorCode: ErrorCode.InvalidPhone.CODE,
    },
  })
  readonly phone: string;

  @ApiProperty({ description: '验证码数据', required: true })
  @IsObject({
    message: ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  captcha: CaptchaType;

}