import {
  IsString,
  Length,
  IsNotEmpty,
  IsEnum,
  IsEmpty,
  MinLength,
  IsNumber,
  Min,
  IsInt,
  IsNumberString
} from 'class-validator';
import { ApiProperty, ApiProduces } from '@nestjs/swagger';

import { ErrorCode } from '../../../constants/error';
import { UserConstants } from '../../../constants/constants';

export class ListDto {

  @ApiProperty({ description: '关键词', required: false })
  keyword?: string;

  @ApiProperty({ description: '每页数量', example: '20', required: false })
  page_size?: number = 20;

 
  @ApiProperty({ description: '页数', example: '1', required: false })
  page_index?: number = 10;

}