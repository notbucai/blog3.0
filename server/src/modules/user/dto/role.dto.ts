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
  ValidateIf,
  IsUUID
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '../../../constants/error';

export class UserChangeRoleDto {


  @IsUUID("4", { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty()
  id: string;

  // @IsEnum(UserRole, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty()
  @IsUUID("4", { message: ErrorCode.ParamsError.MESSAGE })
  role: string;

}