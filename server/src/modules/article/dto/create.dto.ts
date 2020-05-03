import { IsString, Length, IsArray, IsMongoId, ValidateIf, MinLength, IsUrl } from "class-validator";
import { ErrorCode } from "../../../constants/error";
import { ApiProperty } from "@nestjs/swagger";


export class CreateArticleDto {
  @IsString({ message: ErrorCode.ParamsError.MESSAGE })
  @Length(1, 200, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "title" })
  title: string;

  @ValidateIf(o => o.coverURL !== undefined)
  @IsUrl({
    protocols: ['https'],
    require_protocol: false,
  }, { message: "图片必须为url" })
  @ApiProperty({ description: "coverURL" })
  coverURL: string

  // summary: string; // 自动获取前面的150个字
  @IsString({ message: ErrorCode.ParamsError.MESSAGE })
  @MinLength(1, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "htmlContent" })
  htmlContent: string;

  @ValidateIf(o => Array.isArray(o.tags))
  @IsMongoId({ each: true, message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "tags" })
  tags: string[]
}