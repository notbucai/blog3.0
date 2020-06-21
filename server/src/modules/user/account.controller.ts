/*
 * @Author: bucai
 * @Date: 2020-06-03 11:21:49
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-03 14:10:10
 * @Description: 
 */
import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CommonService } from "../../common/common.service";
import { LoggerService } from "../../common/logger.service";
import { ActiveGuard } from "../../core/guards/active.guard";
import { RedisService } from "../../redis/redis.service";
import { ConfigService } from "../../config/config.service";
import { ArticleService } from "../article/article.service";
import { CommentService } from "../comment/comment.service";
import { UnbindPhone, BindPhone } from "./dto/bind.dto";
import { CurUser } from "../../core/decorators/user.decorator";
import { User } from "../../models/user.entity";
import { MyHttpException } from "../../core/exception/my-http.exception";
import { ErrorCode } from '../../constants/error';


@Controller('user/account')
@ApiTags('用户账户相关')
export class AccountController {

  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService
  ) { };

  @Post('/unbind/phone')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: '解绑手机号' })
  async unbindPhone (@CurUser() user: User) {
    // 判断是否已经绑定手机
    if (!user.phone) {
      throw new MyHttpException({
        code: ErrorCode.UserBind.CODE
      });
    }
    // 绑定数据
    return await this.userService.update({ _id: user._id, phone: null } as User)
  }


  @Post('/bind/phone')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: '绑定手机号' })
  async bindPhone (@CurUser() user: User, @Body() bindDto: BindPhone) {

    // 判断用户是否已经绑定手机
    if (user.phone) {
      throw new MyHttpException({
        code: ErrorCode.UserBind.CODE
      });
    }
    // 判断手机号验证码是否匹配
    // TODO: 验证验证码
    const code = await this.redisService.getValidationCode(bindDto.phone);
    console.log('code', bindDto.phone, code);

    let isVerification = true;
    if (code !== bindDto.code) {
      isVerification = false;
    }

    // 测试服务器，减少资源浪费
    if (this.configService.env === this.configService.DEVELOPMENT) {
      if (bindDto.code === '888888') {
        isVerification = true;
      }
    }

    if (!isVerification) {
      throw new MyHttpException({
        code: ErrorCode.InvalidCaptcha.CODE
      });
    }
    // 判断手机号是否已经绑定用户
    this.userService.findByPhone(bindDto.phone);

    // 绑定数据
    return await this.userService.update({ _id: user._id, phone: bindDto.phone } as User)
  }

}