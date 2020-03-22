import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  IsMongoId,
  Min,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';

export class ListCommentDto {

  @ApiProperty({ description: "lastCommentID", required: false })
  @ValidateIf(o => o.lastCommentID !== undefined)
  @IsMongoId({ message: '无效的lastCommentID' })
  readonly lastCommentID?: string;

  @ValidateIf(o => o.limit !== undefined)
  @Min(1)
  @ApiProperty({ description: "limit", required: false })
  readonly limit?: number;

}