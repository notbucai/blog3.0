import {  ArticleUpStatus } from "../../../models/article.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ErrorCode } from "../../../constants/error";

export class ChangeArticleUpStatus {

  @ApiProperty({ description: "status", enum: ArticleUpStatus, default: ArticleUpStatus.Default })
  @IsEnum(ArticleUpStatus, { message: ErrorCode.ParamsError.MESSAGE })
  status: ArticleUpStatus

}