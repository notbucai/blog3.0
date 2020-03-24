import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ErrorCode } from "../../../constants/error";
import { UserStatus } from "../../../models/user.entity";

export class ChangeUserStatus {

  @ApiProperty({ description: "status", enum: UserStatus, default: UserStatus.InActive })
  @IsEnum(UserStatus, { message: ErrorCode.ParamsError.MESSAGE })
  status: UserStatus
}