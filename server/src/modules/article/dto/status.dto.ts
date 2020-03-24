import { ArticleStatus } from "../../../models/article.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ErrorCode } from "../../../constants/error";

export class ChangeArticleStatus {

  @ApiProperty({ description: "status", enum: ArticleStatus, default: ArticleStatus.Verifying })
  @IsEnum(ArticleStatus, { message: ErrorCode.ParamsError.MESSAGE })
  status: ArticleStatus
}