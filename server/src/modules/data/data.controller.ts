import { Controller, Get, Header, Headers, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveGuard } from '../../core/guards/active.guard';
import { DataService } from './data.service';
import { ClientIpService } from '../client-ip/client-ip.service';
import { ReadService } from '../article/read.service';
import { IpAddress } from '../../core/decorators/ipAddress.decorator';
import { CurUser } from '../../core/decorators/user.decorator';
import { User } from '../../entities/User';

@Controller('data')
@ApiTags("数据接口")
export class DataController {

  constructor(
    private readonly articleReadService: ReadService,
    private readonly dataService: DataService,

    private readonly clientIpService: ClientIpService,
  ) { }


  @Get()
  @UseGuards(ActiveGuard)
  async data () {
    const list = [];
    list[0] = this.dataService.articleCount();
    list[1] = this.dataService.commentCount();
    list[2] = this.dataService.userCount();
    list[3] = this.dataService.browseCount();

    list[4] = this.dataService.growthBrowse();
    list[5] = this.dataService.growthComment();
    list[6] = this.dataService.growthUser();

    list[7] = this.dataService.growthBrowseRecent();
    list[8] = this.dataService.growthCommentRecent();
    list[9] = this.dataService.growthUserRecent();

    list[10] = this.dataService.historyBrowse();
    list[11] = this.dataService.historyComment();
    list[12] = this.dataService.historyUser();

    list[13] = this.dataService.tags();
    list[14] = this.dataService.userType();
    list[15] = this.dataService.author();

    const [
      articleCount, commentCount, userCount, browseCount,
      growthBrowse, growthComment, growthUser,
      growthBrowseRecent, growthCommentRecent, growthUserRecent,
      historyBrowse, historyComment, historyUser,
      tags, userType, author
    ] = await Promise.all(list);

    return {
      articleCount, commentCount, userCount, browseCount,
      growthBrowse, growthComment, growthUser,
      growthBrowseRecent, growthCommentRecent, growthUserRecent,
      historyBrowse, historyComment, historyUser,
      tags, userType, author
    }
  }
  @Get('dv')
  async dv () {
    const data = await this.dataService.dv();
    return data || {};
  }

  // @Get('test')
  // async test () {
  //   // todo
  //   return this.clientIpService.generateClientIpInfo();
  // }

  @Get('record')
  async record (@IpAddress() ip: string, @Headers('User-Agent') ua?: string, @CurUser() user?: User) {
    // todo
    return this.dataService.record(ip, ua, user?.id);
  }
}
