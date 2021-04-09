/*
 * @Author: bucai
 * @Date: 2021-04-06 21:55:28
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-09 14:52:44
 * @Description: 
 */
import { IsNotEmpty, IsObject, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../constants/error';
import { OpenMpUser } from '../../models/open_mp_user';

export class AccessTokenDto {

  @ApiProperty({
    description: "客户端id"
  })
  @IsNotEmpty()
  @IsString({
    message: 'client_id ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  client_id: string;

  @ApiProperty({
    description: "客户端secret"
  })
  @IsNotEmpty()
  @IsString({
    message: 'client_secret ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  client_secret: string;

  @ApiProperty({
    description: "请求的类型，填写authorization_code"
  })
  @IsNotEmpty()
  @IsString({
    message: 'grant_type ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  grant_type: string;

  @ApiProperty({
    description: "回调地址，需需与注册应用里的回调地址一致。"
  })
  @IsNotEmpty()
  @IsString({
    message: 'redirect_uri ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  redirect_uri: string;

  @ApiProperty({
    description: "code"
  })
  @IsNotEmpty()
  @IsString({
    message: 'code ' + ErrorCode.ParamsError.MESSAGE,
    context: {
      errorCode: ErrorCode.ParamsError.CODE,
    },
  })
  code: string;

}