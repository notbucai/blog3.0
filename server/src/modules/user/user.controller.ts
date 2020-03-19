import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto, SingInType } from './dto/signin.dto';
import { LoggerService } from '../../common/logger.service';
import { UserService } from './user.service';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { RedisService } from '../../redis/redis.service';
import { ConfigService } from '../../config/config.service';
import { CommonService } from 'src/common/common.service';
import { User } from '../../entity/user.entity';

@Controller('users')
@ApiTags('用户')
export class UserController {

  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) { };

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
    const user = await this.userService.create(signupDto);
    return user;
  }

  @Post('/signin')
  @ApiOperation({ summary: "账号密码登陆" })
  public async signin(@Body() signinDto: SignInDto) {
    this.logger.info({
      data: SignInDto
    });
    const where: any = {};
    // 判断登陆名是什么
    //  where
    // 符合手机号要求就是手机
    // 符合邮箱就是邮箱
    // 不符合就用户名登陆

    if (/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(signinDto.login)) {
      where.phone = signinDto.login;
    } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(signinDto.login)) {
      where.email = signinDto.login;
    } else {
      where.username = signinDto.login;
    }
    const user = await this.userService.findByObj(where);

    if (!user || !this.userService.verifyPassword(signinDto.pass, user.pass)) {
      throw new MyHttpException({ code: ErrorCode.LoginError.CODE })
    }
    const token = await this.commonService.generateToken(user);
    await this.redisService.setUserToken(user._id.toString(), token);
    await this.redisService.setUser(user);
    return token;
  }

  @Post('/:id')
  @ApiOperation({ summary: "用户信息" })
  @ApiParam({ name: "id", example: '5e732d7db681f7439e306e4b' })
  public async user(@Param('id') id: string) {
    if (!id) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.userService.getUser(id);
  }





}
