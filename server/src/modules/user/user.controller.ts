import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { LoggerService } from '../../common/logger.service';
import { UserService } from './user.service';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';

@Controller('users')
@ApiTags('用户')
export class UserController {

  constructor(private readonly logger: LoggerService, private readonly userService: UserService) { };

  @Post('/signup')
  @ApiOperation({ summary: "注册" })
  public async signup(@Body() signupDto: SignUpDto) {
    this.logger.info({
      data: signupDto
    });

    // TODO: 验证验证码

    const existUser = await this.userService.findByPhoneOrUsername(signupDto.phone, signupDto.username);
    if (existUser) {
      if (existUser.phone === signupDto.phone) {
        throw new MyHttpException({
          code: ErrorCode.PhoneExists.CODE,
        });
      }
      throw new MyHttpException({
        code: ErrorCode.UserNameExists.CODE,
      });
    }
    const data = await this.userService.create(signupDto);
    return data;
  }

}
