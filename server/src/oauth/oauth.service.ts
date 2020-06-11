import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../models/user.entity';
import axios from 'axios';
import { ConfigService } from '../config/config.service';
import { UserService } from '../modules/user/user.service';
import { CommonService } from '../common/common.service';
import { LoggerService } from '../common/logger.service';
import { RedisService } from '../redis/redis.service';
import { StateEnum } from './oauth.constant';

@Injectable()
export class OauthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly logger: LoggerService,
    private readonly redisService: RedisService

  ) { }


  public async githubUserData (code: string) {

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
    console.log('userResult=> ', userResult);

    if (!(userResult.status === 200 && !userResult.data.error)) {
      console.log(userResult.data, userResult.status);

      throw Error('Unauthorized');
    }

    return userResult.data;
  }

  public async getOAuthUserInfo (state: StateEnum, code: string) {
    const UserInfoMap = {
      [StateEnum.github]: this.githubUserData.bind(this)
    }
    const fn = UserInfoMap[state];
    if (typeof fn !== 'function') throw Error('Unauthorized');
    return fn(code);
  }

  public async findByUser (state: StateEnum, id: string) {
    // let newUser: User = await this.userService.findByGithubId(githubUser.id);
    const UserInfoMap = {
      [StateEnum.github]: this.userService.findByGithubId.bind(this.userService)
    }
    const fn = UserInfoMap[state];
    if (typeof fn !== 'function') throw Error('Unauthorized');
    return fn(id);
  }

  public getUserInfoKey (state: StateEnum) {
    const keysMap = {
      [StateEnum.github]: {
        avatarURL: "avatar_url",
        username: "login",
        personalHomePage: "blog",
        numberroduce: "bio",
      }
    }
    const keys = keysMap[state];
    return keys;
  }
  public getKeys (state: StateEnum) {
    const keysMap = {
      [StateEnum.github]: {
        githubID: 'id',
        githubAvatarURL: 'avatar_url',
        githubLogin: 'login',
        githubName: 'name',
      }
    }
    const keys = keysMap[state];
    return keys;
  }
  public isBind (state: StateEnum, user: User) {
    const isBindFns = {
      [StateEnum.github]: (user: User) => {
        return user.githubID
      }
    }

    const fn = isBindFns[state];
    console.log('isBindFns',fn, isBindFns, state);

    if (typeof fn !== 'function') throw Error('Unauthorized');
    return fn(user)
  }
  public async updateUser (state: StateEnum, OAuthUser: any, user: User) {
    const _user: any = {
      _id: user._id
    }
    const keys = this.getKeys(state);
    Object.keys(keys).map(key => {
      _user[key] = OAuthUser[keys[key]];
    });
    console.log('user', _user);

    return this.userService.update(_user);
  }

  public async saveUser (state: StateEnum, OAuthUser: any, user: User) {
    const keys = this.getKeys(state);
    const userInfokeys = this.getUserInfoKey(state);
    Object.keys({ ...keys, ...userInfokeys }).map(key => {
      user[key] = OAuthUser[keys[key]];
    });
    user.status = UserStatus.Actived;
    return this.userService.createUser(user);
  }

  public async github (code: string) {

    const githubUser = await this.githubUserData(code);

    let token: string;

    let newUser: User = await this.userService.findByGithubId(githubUser.id);
    // NOTE: 1. 通过github登录名 查询数据库是否绑定 
    if (newUser) {
      // NOTE: 1.1 已绑定生成token
      this.logger.info({ message: "GITHUB已绑定用户", data: newUser })
      token = await this.commonService.generateToken(newUser);
    } else {
      // NOTE: 1.2 未绑定添加数据库
      this.logger.info({ message: "GITHUB未绑定用户", data: { githubID: githubUser.id } })
      const user = new User();
      user.githubID = githubUser.id;
      user.githubAvatarURL = githubUser.avatar_url;
      user.githubLogin = githubUser.login;
      user.githubName = githubUser.name;
      user.avatarURL = githubUser.avatar_url;
      user.username = githubUser.login;
      user.personalHomePage = githubUser.blog;
      user.numberroduce = githubUser.bio;
      user.status = UserStatus.Actived;

      newUser = await this.userService.createUser(user);

    }
    token = await this.commonService.generateToken(newUser)
    await this.redisService.setUserToken(newUser._id.toString(), token);
    await this.redisService.setUser(newUser);
    return token;
  }
}
