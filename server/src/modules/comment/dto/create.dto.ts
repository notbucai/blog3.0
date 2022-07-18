import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  IsMongoId,
  IsUUID,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {


  @ValidateIf(o => o.sourceId !== undefined)
  @IsString({
    message: '无效的sourceId',
  })
  @ApiProperty({ description: "sourceId" })
  @IsUUID("4",{ message: '无效的sourceId UUID' })
  readonly sourceId: string;

  @ValidateIf(o => o.parentId !== undefined)
  @IsUUID("4", { message: '无效的parentId' })
  @ApiProperty({ description: "parentId" })
  readonly parentId: string;

  @ValidateIf(o => o.rootId !== undefined)
  @IsUUID("4", { message: '无效的rootId' })
  @ApiProperty({ description: "rootId" })
  readonly rootId: string;

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