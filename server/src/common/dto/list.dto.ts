/*
 * @Author: bucai
 * @Date: 2020-05-23 10:04:15
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-23 11:12:25
 * @Description: 列表dto
 */ 
import {
  Min,
  ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListDto {

  @ApiProperty({ description: '每页数量', example: 20, required: false })
  @ValidateIf(o => o.page_size !== undefined)
  @Min(1)
  page_size?: number = 20;

  @ApiProperty({ description: '页数', example: 1, required: false })
  @ValidateIf(o => o.page_index !== undefined)
  @Min(1)
  page_index?: number = 1;

}