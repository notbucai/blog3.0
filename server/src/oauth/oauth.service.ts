import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as util from 'util';
import { ConfigService } from 'src/config/config.service';
import { UserService } from '../modules/user/user.service';
import { CommonService } from '../common/common.service';
import { LoggerService } from '../common/logger.service';

@Injectable()
export class OauthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly logger: LoggerService,
  ) { }

  public async github(code: string) {
    console.log(code);

    const result = await axios.post(this.configService.github.accessTokenURL, {
      code,
      client_id: this.configService.github.clientID,
      client_secret: this.configService.github.clientSecret,
    }, {
      headers: { Accept: 'application/json' },
    });

    if (!(result.status === 200 && !result.data.error)) {
      throw Error('Unauthorized');
    }
    console.log('result=> ', result.data);

    const userInfoURL = this.configService.github.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + result.data.access_token },
    });
    console.log('userResult=> ', userResult.data);

    if (!(userResult.status === 200 && !userResult.data.error)) {
      console.log(userResult.data, userResult.status);

      throw Error('Unauthorized');
    }

    const githubUser = userResult.data;

    // NOTE: 1. 通过github登陆名 查询数据库是否绑定 
    const userExist = await this.userService.findByGithubId(githubUser.id);
    if (userExist) {
      // NOTE: 1.1 已绑定生成token
      this.logger.info({ message: "GITHUB已绑定用户", data: userExist })
      return this.commonService.generateToken(userExist);
    } else {
      // NOTE: 1.2 未绑定添加数据库
      this.logger.info({ message: "GITHUB未绑定用户", data: { githubID: githubUser.id } })
      const user = new User();
      user.githubID = githubUser.id;
      user.githubAvatarURL = githubUser.avatar_url;
      user.githubLogin = githubUser.login;
      user.githubName = githubUser.name;
      user.avatarURL = githubUser.avatar_url;
      user.username = githubUser.name || githubUser.login;
      user.personalHomePage = githubUser.blog;
      user.numberroduce = githubUser.bio;
      user.status = UserStatus.Actived;

      const newUser = await this.userService.createUser(user);

      return this.commonService.generateToken(newUser);
    }
  }
}
