import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from 'src/config/config.service';
import { OauthService } from './oauth.service';
import { LoggerService } from '../common/logger.service';

@Controller('oauth')
@ApiTags('OAuth')
export class OauthController {

  constructor(private readonly oauthService: OauthService, 
    private readonly logger: LoggerService) { }

  // https://github.com/login/oauth/authorize?client_id=121bf37951669bd171d4&state=github
  @Get('login')
  @ApiOperation({ summary: 'oauth登陆' })
  public async github(@Res() res, @Query('code') code: string, @Query('state') state: string) {
    this.logger.info({ data: 'login ' + state });
    let data = null;
    try {
      const token = this.oauthService[state] && await this.oauthService[state](code);

      data = {
        "success": true,
        "msg": '成功',
        token
      };
    } catch (error) {
      data = {
        "success": false,
        "msg": error.message || 'Unauthorized',
      };
    }

    return res.render('oauth/login', {
      data: JSON.stringify(data)
    });
  }
}
