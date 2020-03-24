import { Controller, Get, Param, Body, Post, Put, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto, SingInType } from './dto/signin.dto';
import { LoggerService } from '../../common/logger.service';
import { UserService } from './user.service';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { RedisService } from '../../redis/redis.service';
import { ConfigService } from '../../config/config.service';
import { CommonService } from '../../common/common.service';
import { User, UserRole } from '../../models/user.entity';
import { RepassDto } from './dto/repass.dto';
import { ActiveGuard } from '../../core/guards/active.guard';
import { CurUser } from '../../core/decorators/user.decorator';
import { UpdateUserInfoDto } from './dto/update-userinfo.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ListDto } from './dto/list.dto';
import { UserChangeRoleDto } from './dto/role.dto';

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
    return {};
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

  @Get('/info')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "当前用户信息" })
  @ApiBearerAuth()
  public async logininfo(@CurUser() user: User) {
    return user;
  }

  /**
    * 更新用户信息(头像、职位、公司、个人介绍、个人主页)
    */
  @Put(`/info`)
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: " 更新用户信息(头像、职位、公司、个人介绍、个人主页)" })
  @ApiBearerAuth()
  async updateUserInfo(@CurUser() user: User, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    await this.userService.updateUserInfo(user._id, updateUserInfoDto);
    return {};
  }

  /**
    * 列表
    */
  @Get(`/list`)
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({ summary: "用户列表" })
  @ApiBearerAuth()
  async list(@Query() listDto: ListDto) {
    if (listDto.page_index < 1 || listDto.page_size < 1) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    }
    return this.userService.findList(listDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: "用户信息" })
  @ApiParam({ name: "id", example: '5e732d7db681f7439e306e4b' })
  public async user(@Param('id') id: string) {
    if (!id) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.userService.getUser(id);
  }


  @Put('/repass')
  @ApiOperation({ summary: "重置密码" })
  public async repass(@Body() repassDto: RepassDto) {
    this.logger.info({
      data: repassDto
    });

    // TODO: 验证验证码
    const code = await this.redisService.getValidationCode(repassDto.login);
    let isVerification = true;
    if (code !== repassDto.code) {
      isVerification = false;
    }

    // 测试服务器，减少资源浪费
    if (this.configService.env === this.configService.DEVELOPMENT) {
      if (repassDto.code === '888888') {
        isVerification = true;
      }
    }

    if (!isVerification) {
      throw new MyHttpException({
        code: ErrorCode.InvalidCaptcha.CODE
      });
    }
    const where: any = {};
    // 判断登陆名是什么
    //  where
    // 符合手机号要求就是手机
    // 符合邮箱就是邮箱
    // 不符合就用户名登陆
    if (/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(repassDto.login)) {
      where.phone = repassDto.login;
    } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(repassDto.login)) {
      where.email = repassDto.login;
    } else {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE
      });
    }
    const existUser = await this.userService.findByObj(where);
    if (!existUser) {
      throw new MyHttpException({
        code: ErrorCode.UserNoExists.CODE,
      });
    }
    await this.userService.repass(existUser._id, repassDto.pass);
    return {};
  }

  @Post('change/role')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @ApiOperation({ summary: "修改用户权限" })
  @ApiBearerAuth()
  async changeRole(@Body() RoleDto: UserChangeRoleDto, @CurUser() user: User) {
    if (user._id.toHexString() === RoleDto.id) {
      throw new MyHttpException({ message: "不能给自己操作" })
    }
    if (RoleDto.role >= UserRole.SuperAdmin) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    }
    return this.userService.changeRole(RoleDto.id, RoleDto.role);
  }

}