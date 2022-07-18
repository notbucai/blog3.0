/*
 * @Author: bucai
 * @Date: 2020-03-26 16:54:20
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-07-17 12:21:02
 * @Description: 
 */
import {
  ValidateIf,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../../constants/error';

export class BindAclDto {

  @ValidateIf(o => o.acls != undefined)
  @IsUUID("4", { each: true, message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "权限" })
  acls: string[]

}