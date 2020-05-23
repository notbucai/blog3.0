import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  ValidateIf,
  IsMongoId,
} from 'class-validator';
import { CommentConstants } from '../../../constants/comment';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {


  @ValidateIf(o => o.sourceID !== undefined)
  @IsString({
    message: '无效的sourceID',
  })
  @ApiProperty({ description: "sourceID" })
  @IsMongoId({ message: '无效的sourceID' })
  readonly sourceID: string;

  @ValidateIf(o => o.parentID !== undefined)
  @IsMongoId({ message: '无效的parentID' })
  @ApiProperty({ description: "parentID" })
  readonly parentID: string;

  @ValidateIf(o => o.rootID !== undefined)
  @IsMongoId({ message: '无效的rootID' })
  @ApiProperty({ description: "rootID" })
  readonly rootID: string;

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