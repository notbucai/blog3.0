import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { LoggerService } from '../../common/logger.service';
import { UserService } from './user.service';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { RedisService } from '../../redis/redis.service';
import { ConfigService } from '../../config/config.service';

@Controller('users')
@ApiTags('用户')
export class UserController {

  constructor(private readonly logger: LoggerService, private readonly userService: UserService, private readonly redisService: RedisService, private readonly configService: ConfigService) { };

  @Post('/signup')
  @ApiOperation({ summary: "注册" })
  public async signup(@Body() signupDto: SignUpDto) {
    this.logger.info({
      data: signupDto
    });

    // TODO: 验证验证码

    const code = await this.redisService.getValidationCode(signupDto.phone);
    let isVerification = true;
    if (code !== signupDto.code) {
      isVerification = false;
    }

    // 测试服务器，减少资源浪费
    if (this.configService.env === this.configService.DEVELOPMENT) {
      if (signupDto.code === '888888') {
        isVerification = true;
      }
    }

    if (!isVerification) {
      throw new MyHttpException({
        code: ErrorCode.InvalidCaptcha.CODE
      });
    }

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

  @Post('/signin')
  @ApiOperation({ summary: "登陆" })
  public async signin(@Body() signupDto: SignUpDto) {
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
