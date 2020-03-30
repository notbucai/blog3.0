/*
 * @Author: bucai
 * @Date: 2020-03-26 16:54:20
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-26 19:53:19
 * @Description: 
 */
import {
  ValidateIf,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../../constants/error';

export class BindAclDto {

  @ValidateIf(o => o.acls != undefined)
  @IsMongoId({ each: true, message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "权限" })
  acls: string[]

}