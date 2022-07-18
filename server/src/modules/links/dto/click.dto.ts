/*
 * @Author: bucai
 * @Date: 2020-06-20 11:07:59
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-06-29 12:33:40
 * @Description: 
 */
import { IsEnum, IsString, ValidateIf, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ClickLinkDto {

  @ApiProperty({ description: 'id', required: true })
  @IsString()
  id: string

}