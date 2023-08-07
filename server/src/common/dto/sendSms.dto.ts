/*
 * @Author: bucai
 * @Date: 2021-04-02 00:04:51
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-04-08 21:49:47
 * @Description:
 */
import { IsMobilePhone, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../constants/error';

export type CaptchaType = {
  ticket: string;
  randstr: string;
};

export class SendSmsDto {
  @ApiProperty({
    description: '手机号',
    example: '13767284559',
    required: true,
  })
  @IsMobilePhone('zh-CN', {
    message: ErrorCode.InvalidPhone.MESSAGE,
    context: {
      errorCode: ErrorCode.InvalidPhone.CODE,
    },
  })
  readonly phone: string;

  @ApiProperty({ description: '验证码数据', required: true })
  @IsString({
    message: ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  readonly captchaVerifyParam: string;

  // @ApiProperty({ description: '验证码数据', required: true })
  // @IsObject({
  //   message: ErrorCode.ParamsError.MESSAGE,
  //   context: {
  //     errorCode: ErrorCode.ParamsError.CODE,
  //   },
  // })
  // captcha: CaptchaType;
}
