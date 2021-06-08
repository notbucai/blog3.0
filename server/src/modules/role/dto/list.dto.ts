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
  IsNumberString,
  ValidateIf
} from 'class-validator';
import { ApiProperty, ApiProduces } from '@nestjs/swagger';
import { ErrorCode } from '../../../constants/error';

export class RoleListDto {

  @ApiProperty({ description: '每页数量', example: 20, required: false })
  @ValidateIf(o => o.page_size !== undefined)
  @Min(1)
  page_size?: number = 20;

  @ApiProperty({ description: '页数', example: 1, required: false })
  @ValidateIf(o => o.page_index !== undefined)
  @Min(1)
  page_index?: number = 1;

  @ApiProperty({ description: '关键词', required: false })
  @ValidateIf(o => o.keyword !== undefined)
  @MinLength(1, { message: ErrorCode.ParamsError.MESSAGE })
  keyword?: string;

}