import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ErrorCode } from "../../../constants/error";
import { CommentStatus } from "../../../models/comment.entity";

export class ChangeCommentStatusDto {

  @ApiProperty({ description: "status", enum: CommentStatus, default: CommentStatus.Verifying })
  @IsEnum(CommentStatus, { message: ErrorCode.ParamsError.MESSAGE })
  status: CommentStatus
}