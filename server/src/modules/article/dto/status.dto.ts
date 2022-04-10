import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ContentStatus } from "../../../constants/constants";
import { ErrorCode } from "../../../constants/error";

export class ChangeArticleStatus {

  @ApiProperty({ description: "status", enum: ContentStatus, default: ContentStatus.Verifying })
  @IsEnum(ContentStatus, { message: ErrorCode.ParamsError.MESSAGE })
  status: ContentStatus
}