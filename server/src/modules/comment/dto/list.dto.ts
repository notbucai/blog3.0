import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';

export class ListCommentDto {

  @ApiProperty({ description: "lastCommentID", required: false })
  readonly lastCommentID?: string;

  @ApiProperty({ description: "limit", required: false })
  readonly limit?: number;

}