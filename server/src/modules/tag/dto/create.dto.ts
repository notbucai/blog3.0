import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  Length,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../../constants/error';

export class CreateDto {

  @IsString()
  @Length(1, 50, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "name" })
  name: string;

  @IsString()
  @Length(1, 50, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "icon" })
  iconUrl: string;
}