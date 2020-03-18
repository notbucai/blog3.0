import {
  IsString,
  IsMobilePhone,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '../../constants/error';
import { UserConstants } from '../../constants/constants';

export class FileDto {
  filename: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  encoding: string;
}

export class ImgUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: FileDto;
}