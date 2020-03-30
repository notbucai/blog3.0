/*
 * @Author: bucai
 * @Date: 2020-03-26 16:54:02
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-26 20:38:56
 * @Description: 
 */
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  Length,
  IsMongoId,
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

  @IsMongoId({ message: ErrorCode.ParamsError.MESSAGE })
  @ValidateIf(o => o.parent != undefined)
  @ApiProperty({ description: "parent" })
  parent: string
}