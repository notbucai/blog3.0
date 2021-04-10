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

    const userInfoURL = this.configService.github.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + result.data.access_token },
    });

    if (!(userResult.status === 200 && !userResult.data.error)) {

      throw Error('Unauthorized');
    }

    return userResult.data;
  }

  public async baiduUserData (code: string, redirect_uri: string) {

    const result = await axios.get(this.configService.baidu.accessTokenURL, {
      params: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
        client_id: this.configService.baidu.clientID,
        client_secret: this.configService.baidu.clientSecret,
      },
      headers: { Accept: 'application/json' },
    });

    if (!(result.status === 200 && !result.data.error)) {
      throw Error('Unauthorized');
    }

    const userInfoURL = this.configService.baidu.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      params: {
        access_token: result.data.access_token
      },
      headers: { Accept: 'application/json' },
    });

    if (!(userResult.status === 200 && !userResult.data.error)) {
      throw Error('Unauthorized');
    }

    const resData = {
      ...userResult.data,
      id: userResult.data.openid,
      uname: userResult.data.uname || userResult.data.openid,
      portrait: 'http://tb.himg.baidu.com/sys/portrait/item/' + userResult.data.portrait
    }

    return resData;
  }

  public async weiboUserData (code: string, redirect_uri: string) {
    const result = await axios.post(this.configService.weibo.accessTokenURL, {}, {
      params: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
        client_id: this.configService.weibo.clientID,
        client_secret: this.configService.weibo.clientSecret,
      },
      headers: { Accept: 'application/json' },
    });

    if (!(result.status === 200 && !result.data.error)) {
      throw Error('Unauthorized');
    }

    const userInfoURL = this.configService.weibo.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      params: {
        access_token: result.data.access_token,
        uid: result.data.uid
      },
      headers: { Accept: 'application/json' },
    });

    if (!(userResult.status === 200 && !userResult.data.error)) {
      throw Error('Unauthorized');
    }

    const resData = {
      ...userResult.data
    }

    return resData;
  }

  public async qqUserData (code: string, redirect_uri: string) {
    const result = await axios.get(this.configService.qq.accessTokenURL, {
      params: {
        code,
        redirect_uri,
        fmt: 'json',
        grant_type: 'authorization_code',
        client_id: this.configService.qq.clientID,
        client_secret: this.configService.qq.clientSecret,
      },
      headers: { Accept: 'application/json' },
    });

    if (!(result.status === 200 && !result.data.error)) {
      throw Error('Unauthorized');
    }

    const userOpenIdUrl = this.configService.qq.getTokenInfo;
    const userOpenIdResult = await axios.get(userOpenIdUrl, {
      params: {
        fmt: 'json',
        access_token: result.data.access_token,
      },
      headers: { Accept: 'application/json' },
    });
    if (!(userOpenIdResult.status === 200 && !result.data.error)) {
      throw Error('Unauthorized');
    }

    const userInfoURL = this.configService.qq.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      params: {
        format: 'json',
        access_token: result.data.access_token,
        oauth_consumer_key: userOpenIdResult.data.client_id,
        openid: userOpenIdResult.data.openid,
      },
      headers: { Accept: 'application/json' },
    });
    console.log('userResult.data', userResult.data, userOpenIdResult.data);
    if (!(userResult.status === 200 && userResult.data.ret == 0)) {
      throw Error('Unauthorized');
    }

    const resData = {
      id: userOpenIdResult.data.openid,
      ...userResult.data,
      figureurl: userResult.data.figureurl_qq_2 || userResult.data.figureurl_2 || userResult.data.figureurl_1 || userResult.data.figureurl_qq_1 || userResult.data.figureurl
    }

    return resData;
  }

  public async notbucaiUserData (code: string, redirect_uri: string) {
    const result = await axios.post(this.configService.wxmp.accessTokenURL, {
      code,
      redirect_uri,
      grant_type: 'authorization_code',
      client_id: this.configService.wxmp.clientID,
      client_secret: this.configService.wxmp.clientSecret,
    }, {
      headers: { Accept: 'application/json' },
    });
    console.log('result', result);
    if (!(result.status < 400 && !result.data.error)) {
      throw Error('Unauthorized');
    }

    const _resData = result.data;

    if (_resData.code !== 0) {
      throw Error('Unauthorized' + _resData.message);
    }

    const userInfoURL = this.configService.wxmp.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      params: {
        access_token: _resData.data.access_token,
      },
      headers: { Accept: 'application/json' },
    });

    console.log('userResult', userResult);
    if (!(userResult.status === 200 && !userResult.data.error)) {
      throw Error('Unauthorized');
    }

    const _resUserData = userResult.data;

    if (_resUserData.code !== 0) {
      throw Error('Unauthorized' + _resUserData.message);
    }
    const resData = {
      ..._resUserData.data,
      id: _resUserData.data._id
    }

    return resData;
  }

  public async giteeUserData (code: string, redirect_uri: string) {
    const result = await axios.post(this.configService.gitee.accessTokenURL, {}, {
      params: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
        client_id: this.configService.gitee.clientID,
        client_secret: this.configService.gitee.clientSecret,
      },
      headers: { Accept: 'application/json' },
    });

    if (!(result.status === 200 && !result.data.error)) {
      throw Error('Unauthorized');
    }

    const userInfoURL = this.configService.gitee.userInfoURL;
    const userResult = await axios.get(userInfoURL, {
      params: {
        access_token: result.data.access_token,
      },
      headers: { Accept: 'application/json' },
    });

    if (!(userResult.status === 200 && !userResult.data.error)) {
      throw Error('Unauthorized');
    }
    const resData = {
      ...userResult.data
    }

    return resData;
  }

  public async getOAuthUserInfo (state: StateEnum, code: string, redirect_uri: string) {
    const UserInfoMap = {
      [StateEnum.github]: this.githubUserData.bind(this),
      [StateEnum.baidu]: this.baiduUserData.bind(this),
      [StateEnum.weibo]: this.weiboUserData.bind(this),
      [StateEnum.qq]: this.qqUserData.bind(this),
      [StateEnum.gitee]: this.giteeUserData.bind(this),
      [StateEnum.notbucai]: this.notbucaiUserData.bind(this),
    }
    const fn = UserInfoMap[state];
    if (typeof fn !== 'function') throw Error('Unauthorized');
    return fn(code, redirect_uri);
  }

  public async findByUser (state: StateEnum, id: string) {
    // let newUser: User = await this.userService.findByGithubId(githubUser.id);
    const UserInfoMap = {
      [StateEnum.github]: this.userService.findByGithubId.bind(this.userService),
      [StateEnum.baidu]: this.userService.findByBaiduId.bind(this.userService),
      [StateEnum.weibo]: this.userService.findByWeiboId.bind(this.userService),
      [StateEnum.gitee]: this.userService.findByGiteeId.bind(this.userService),
      [StateEnum.qq]: this.userService.findByQQId.bind(this.userService),
      [StateEnum.notbucai]: this.userService.findByNotbucaiId.bind(this.userService),
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
      },
      [StateEnum.baidu]: {
        avatarURL: "portrait",
        username: "uname"
      },
      [StateEnum.weibo]: {
        avatarURL: "profile_image_url",
        username: "screen_name",
        personalHomePage: "url",
        numberroduce: "remark"
      },
      [StateEnum.qq]: {
        avatarURL: "figureurl",
        username: "nickname",
      },
      [StateEnum.gitee]: {
        avatarURL: "avatar_url",
        username: "login",
        personalHomePage: "url",
        numberroduce: "bio"
      },
      [StateEnum.notbucai]: {
        avatarURL: "avatarUrl",
        username: "nickname",
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
      },
      [StateEnum.baidu]: {
        baiduID: 'openid',
        baiduAvatarURL: 'portrait',
        baiduName: 'uname',
      },
      [StateEnum.weibo]: {
        weiboID: 'id',
        weiboAvatarURL: 'profile_image_url',
        weiboName: 'name',
        weiboScreenName: "screen_name",
        weiboAvatarLarge: "avatar_large",
      },
      [StateEnum.qq]: {
        qqID: 'id',
        qqAvatar: 'figureurl',
        qqName: 'nickname',
      },
      [StateEnum.gitee]: {
        giteeID: 'id',
        giteeAvatar: 'avatar_url',
        giteeName: 'name',
        giteeLogin: 'login',
        giteeUrl: 'url',
      },
      [StateEnum.notbucai]: {
        notbucaiID: 'id',
        notbucaiOpenid: 'openid',
        notbucaiNickname: 'nickname',
        notbucaiAvatarUrl: 'avatarUrl',
      }
    }
    const keys = keysMap[state];
    return keys;
  }
  public isBind (state: StateEnum, user: User) {
    const isBindFns = {
      [StateEnum.github]: (user: User) => {
        return user.githubID
      },
      [StateEnum.qq]: (user: User) => {
        return user.qqID
      },
      [StateEnum.gitee]: (user: User) => {
        return user.giteeID
      },
      [StateEnum.baidu]: (user: User) => {
        return user.baiduID
      },
      [StateEnum.weibo]: (user: User) => {
        return user.weiboID
      },
      [StateEnum.notbucai]: (user: User) => {
        return user.notbucaiID
      }
    }
    console.log('isbind user', user);
    const fn = isBindFns[state];

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

    return this.userService.update(_user);
  }

  public async saveUser (state: StateEnum, OAuthUser: any, user: User) {
    const keys = this.getKeys(state);
    const userInfokeys = this.getUserInfoKey(state);
    const allKeys = { ...keys, ...userInfokeys };
    Object.keys(allKeys).map(key => {
      user[key] = OAuthUser[allKeys[key]];
    });

    user.status = UserStatus.Actived;
    return this.userService.createUser(user);
  }

  // public async github (code: string) {

  //   const githubUser = await this.githubUserData(code);

  //   let token: string;

  //   let newUser: User = await this.userService.findByGithubId(githubUser.id);
  //   // NOTE: 1. 通过github登录名 查询数据库是否绑定 
  //   if (newUser) {
  //     // NOTE: 1.1 已绑定生成token
  //     this.logger.info({ message: "GITHUB已绑定用户", data: newUser })
  //     token = await this.commonService.generateToken(newUser);
  //   } else {
  //     // NOTE: 1.2 未绑定添加数据库
  //     this.logger.info({ message: "GITHUB未绑定用户", data: { githubID: githubUser.id } })
  //     const user = new User();
  //     user.githubID = githubUser.id;
  //     user.githubAvatarURL = githubUser.avatar_url;
  //     user.githubLogin = githubUser.login;
  //     user.githubName = githubUser.name;
  //     user.avatarURL = githubUser.avatar_url;
  //     user.username = githubUser.login;
  //     user.personalHomePage = githubUser.blog;
  //     user.numberroduce = githubUser.bio;
  //     user.status = UserStatus.Actived;

  //     newUser = await this.userService.createUser(user);

  //   }
  //   token = await this.commonService.generateToken(newUser)
  //   await this.redisService.setUserToken(newUser._id.toString(), token);
  //   await this.redisService.setUser(newUser);
  //   return token;
  // }
}
