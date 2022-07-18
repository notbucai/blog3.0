/*
 * @Author: bucai
 * @Date: 2020-06-20 11:07:59
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-06-29 12:01:19
 * @Description: 
 */
import { IsEnum, IsString, ValidateIf, IsUrl } from "class-validator";
import { LinkType } from "../../../models/links.entity";
import { ErrorCode } from "../../../constants/error";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLinkDto {

  // @ApiProperty({ description: '类型', enum: LinkType, required: true })
  // @IsEnum(LinkType, { message: ErrorCode.ParamsError.MESSAGE })
  // type: LinkType;

  @ApiProperty({ description: '标题', required: true })
  @IsString()
  title: string


  @ApiProperty({ description: 'url', required: true })
  @IsUrl({
    protocols: ['https', 'http'],
    require_protocol: true,
  })
  url: string

  @ApiProperty({ description: 'logo' })
  @ValidateIf(o => o.logo !== undefined)
  @IsUrl({
    protocols: ['https', 'http'],
    require_protocol: true,
  })
  logo: string

  @ApiProperty({ description: 'intro' })
  @ValidateIf(o => o.intro !== undefined)
  @IsString()
  intro: string

}