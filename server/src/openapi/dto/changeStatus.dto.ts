/*
 * @Author: bucai
 * @Date: 2021-04-06 21:55:28
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-06 22:24:07
 * @Description: 
 */
import { IsObject, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../constants/error';
import { OpenMpUser } from '../../models/open_mp_user';

export class ChangeStatus {

  @ApiProperty({
    description: "用户信息"
  })
  @IsObject({
    message: 'user ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  user?: OpenMpUser;

  @ApiProperty({
    description: "token"
  })
  @IsString({
    message: 'token ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  token: string;

  @ApiProperty({
    description: "code"
  })
  @IsString({
    message: 'code ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  code: string;

}