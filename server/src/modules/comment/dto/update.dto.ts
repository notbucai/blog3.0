import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @MinLength(CommentConstants.MinContentLength, {
    message: '评论内容过少哦',
  })
  @MaxLength(CommentConstants.MaxContentLength, {
    message: '评论不能超过 $constraint1 个字符',
  })
  @IsString()
  @ApiProperty({ description: "content" })
  readonly content: string;
}