import { Controller, Get, Param, Body, Post, Put, UseGuards, Query, Delete } from '@nestjs/common';
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
import { User, } from '../../models/user.entity';
import { RepassDto } from './dto/repass.dto';
import { ActiveGuard } from '../../core/guards/active.guard';
import { CurUser } from '../../core/decorators/user.decorator';
import { UpdateUserInfoDto } from './dto/update-userinfo.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ListDto } from './dto/list.dto';
import { UserChangeRoleDto } from './dto/role.dto';
import { ObjectID } from 'mongodb';
import { ChangeUserStatus } from './dto/status.dto';
import { CommentService } from '../comment/comment.service';
import { ArticleService } from '../article/article.service';
import { NotifyService } from '../../common/notify.service';
import { RoleService } from '../role/role.service';
import { Role } from '../../models/role.entity';
import { AclService } from '../role/acl.service';

@Controller('users')
@ApiTags('用户')
export class UserController {

  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly articleService: ArticleService,
    private readonly roleService: RoleService,
    private readonly aclService: AclService,
    private readonly commentService: CommentService,
    private readonly notifyService: NotifyService,
  ) { };

  @Post('/signup')
  @ApiOperation({ summary: "注册" })
  public async signup (@Body() signupDto: SignUpDto) {

    // TODO: 验证验证码
    const code = await this.redisService.getValidationCode(signupDto.phone);
    this.logger.info({
      data: {
        signupDto,
        code
      },
    });
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
    const token = await this.commonService.generateToken(user);
    // 更新登录时间,异步即可
    this.userService.updateLoginTime(user._id);
    await this.redisService.setUserToken(user._id.toString(), token);
    await this.redisService.setUser(user);
    return token;
  }

  @Post('/signin')
  @ApiOperation({ summary: "账号密码登录" })
  public async signin (@Body() signinDto: SignInDto) {
    this.logger.info({
      data: SignInDto
    });
    const where: any = {};
    // 判断登录名是什么
    //  where
    // 符合手机号要求就是手机
    // 符合邮箱就是邮箱
    // 不符合就用户名登录

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
    // 更新登录时间
    this.userService.updateLoginTime(user._id);
    await this.redisService.setUserToken(user._id.toString(), token);
    await this.redisService.setUser(user);
    return token;
  }

  @Get('/info')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "当前用户信息" })
  @ApiBearerAuth()
  public async logininfo (@CurUser() user: User) {
    return user;
  }

  @Get('/role')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "当前用户角色权限信息" })
  @ApiBearerAuth()
  public async permissions (@CurUser() user: User) {
    let role = user.role;
    if (user.isAdmin) {
      // 获取所有权限
      // this.roleService.list()
      role = new Role();
      role.name = "SYSTEM";
      role.acls = await this.aclService.findAll();
    }
    return role || {};
  }

  /**
    * 更新用户信息(头像、职位、公司、个人介绍、个人主页)
    */
  @Put(`/info`)
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: " 更新用户信息(头像、职位、公司、个人介绍、个人主页)" })
  @ApiBearerAuth()
  async updateUserInfo (@CurUser() user: User, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    await this.userService.updateUserInfo(user._id, updateUserInfoDto);
    return {};
  }

  /**
    * 消息数量
    */
  @Get(`/notify/count`)
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "获取用户消息数量" })
  @ApiBearerAuth()
  async notifyCount (@CurUser() user: User) {
    const count = await this.notifyService.getNoReadNotifyConuntByUId(user._id);
    return {
      unread: count || 0
    };
  }

  /**
    * 消息列表
    */
  @Get(`/notify/list`)
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "获取用户消息列表" })
  @ApiBearerAuth()
  async notifyList (@CurUser() user: User) {
    await this.notifyService.readAllByUserId(user._id);
    const list = await this.notifyService.getNotifyListByUserId(user._id);
    return list;
  }

  /**
    * 清空消息列表
    */
  @Delete(`/notify/clear`)
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "清空消息列表" })
  @ApiBearerAuth()
  async notifyClear (@CurUser() user: User) {
    return await this.notifyService.clearNotifyListByUserId(user._id);
  }

  /**
    * 删除单条
    */
  @Delete(`/notify/:id`)
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: "清空消息列表" })
  @ApiBearerAuth()
  async notifyRemoveById (@CurUser() user: User, @Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    const nid = new ObjectID(id);
    return await this.notifyService.delNotifyListById(user._id, nid);
  }

  /**
    * 列表
    */
  @Get(`/list`)
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('UserList')
  @ApiOperation({ summary: "用户列表" })
  @ApiBearerAuth()
  async list (@Query() listDto: ListDto) {
    if (listDto.page_index < 1 || listDto.page_size < 1) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    }
    return this.userService.findList(listDto, {
      createdAt: -1
    });
  }

  /**
    * 列表
    */
  @Get(`/list/show`)
  @ApiOperation({ summary: "用户圈子列表" })
  async listForShow () {
    const list = await this.userService.findNowLoginList();
    return list;
  }

  @Get('/:id')
  @ApiOperation({ summary: "用户信息" })
  @ApiParam({ name: "id", example: '5e84512f2058ff40cc3dc344' })
  public async user (@Param('id') id: string) {
    if (!id) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    const user = await this.userService.getBasiceUser(id);
    if (typeof user == 'undefined' || user === null) {
      throw new MyHttpException({ code: ErrorCode.UserNoExists.CODE });
    }

    return user;
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('ChangeStatus')
  async changeStatus (@Param('id') id: string, @Body() body: ChangeUserStatus) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.userService.changeStatus(id, body.status);
  }

  @Get(':id/achievement')
  @ApiOperation({ summary: "获取用户成就" })
  async achievement (@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.userService.achievement(id);
  }


  @Get(':id/article')
  @ApiOperation({ summary: "获取用户文章" })
  async articleList (@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.articleService.listByUserId(id);
  }

  @Get(':id/:source/comment')
  @ApiOperation({ summary: "获取用户评论" })
  async commentlist (@Param('id') id: string, @Param('source') source: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    if (!this.commentService.isValidSource(source)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.commentService.getListByUserId(source, id);
  }

  @Put('/repass')
  @ApiOperation({ summary: "重置密码" })
  public async repass (@Body() repassDto: RepassDto) {
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
    // 判断登录名是什么
    //  where
    // 符合手机号要求就是手机
    // 符合邮箱就是邮箱
    // 不符合就用户名登录
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
  @Roles('BindRole', true)
  @ApiOperation({ summary: "修改用户权限" })
  @ApiBearerAuth()
  async changeRole (@Body() RoleDto: UserChangeRoleDto, @CurUser() user: User) {
    if (user._id.toHexString() === RoleDto.id) {
      throw new MyHttpException({ message: "不能给自己操作" })
    }
    return this.userService.changeRole(RoleDto.id, RoleDto.role);
  }

}
