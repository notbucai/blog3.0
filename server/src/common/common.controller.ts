import { Controller, Post, UseInterceptors, UploadedFile, Get, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as util from 'util';

import { ImgUploadDto, FileDto } from './dto/imgUpload.dto';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { CosService } from './cos.service';
import { SMSService } from './sms.service';
import { RedisService } from '../redis/redis.service';
import { CodeConstants } from '../constants/constants';
import { EmailService } from './email.service';
import { TencentCloudService } from './tencentcloud/tencentCloud.service';
import { ActiveGuard } from '../core/guards/active.guard';
import { IpAddress } from 'src/core/decorators/ipAddress.decorator';
import { SendSmsDto } from './dto/sendSms.dto';

@Controller('common')
@ApiTags('公共接口')
export class CommonController {

  constructor(
    private readonly cosService: CosService,
    private readonly smsService: SMSService,
    private readonly emailService: EmailService,
    private readonly tencentCloudService: TencentCloudService,
    private readonly redisService: RedisService
  ) { }

  @Post('uploadImage')
  @UseGuards(ActiveGuard)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter (req, file, callback) {
      if (!file.mimetype.startsWith('image/')) {
        callback(new MyHttpException({
          code: ErrorCode.ImageTypeError.CODE
        }), false);
      } else {
        callback(null, true);
      }
    }
  }))
  @ApiBearerAuth()
  @ApiOperation({ summary: "图片上传" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: ImgUploadDto,
  })
  public uploadImage (@UploadedFile() file: FileDto) {
    return this.cosService.uploadImage(file);
  }

  @Post('sendPhoneCode')
  @ApiOperation({ summary: "发送手机验证码" })
  @ApiQuery({ name: 'phone', example: "13767284559" })
  public async sendPhoneCode (@Body() reqData: SendSmsDto, @IpAddress() ipAddress: string) {
    const { phone, captcha } = reqData
    const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
    if (!reg.test(phone)) {
      throw new MyHttpException({ code: ErrorCode.InvalidPhone.CODE });
    }
    console.log('ipAddress', ipAddress);

    // 验证验证码
    await this.tencentCloudService.DescribeCaptchaResult(captcha.ticket, captcha.randstr, ipAddress);

    const expire = 10; // 10分钟
    const reExpireSecond = CodeConstants.CODE_REREPEAT; // 重复请求 间隔 60 second
    // 判断间隔
    const oldCodeTime = await this.redisService.getValidationCodeTime(phone);

    if (oldCodeTime) {
      throw new MyHttpException({ code: ErrorCode.RequestRepeat.CODE });
    }

    const code: string = await this.smsService.sendSMSCode(phone, expire);
    this.redisService.setValidationCodeTime(phone, reExpireSecond); // 储存间隔
    this.redisService.setValidationCode(phone, code, expire); // 储存验证码
    return {};
  }

  @Get('sendEmailCode')
  @ApiOperation({ summary: "发送邮箱验证码" })
  @ApiQuery({ name: 'email', example: "1450941858@qq.com" })
  public async sendEmailCode (@Query('email') email: string) {
    const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!reg.test(email)) {
      throw new MyHttpException({ code: ErrorCode.InvalidPhone.CODE });
    }
    const expire = 10; // 10分钟
    const code: string = await this.emailService.sendCode(email);
    this.redisService.setValidationCode(email, code, expire); // 储存验证码
    return {};
  }
}
