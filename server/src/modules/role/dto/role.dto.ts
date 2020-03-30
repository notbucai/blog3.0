/*
 * @Author: bucai
 * @Date: 2020-03-26 16:54:20
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-26 16:57:19
 * @Description: 
 */
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../../constants/error';

export class CreateRoleDto {

  @IsString()
  @Length(1, 50, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "name" })
  name: string;

}