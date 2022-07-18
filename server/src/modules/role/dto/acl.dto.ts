/*
 * @Author: bucai
 * @Date: 2020-03-26 16:54:02
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-07-17 12:21:07
 * @Description: 
 */
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  Length,
  IsUUID,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../../constants/error';

export class CreateAclDto {

  @IsString()
  @Length(1, 50, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "name" })
  name: string;

  @IsString()
  @Length(1, 50, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "title" })
  title: string;

  @IsUUID("4", { message: ErrorCode.ParamsError.MESSAGE })
  @ValidateIf(o => o.parent != undefined)
  @ApiProperty({ description: "parent" })
  parent: string
}