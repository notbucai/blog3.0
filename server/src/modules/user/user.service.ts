import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as _ from 'lodash';

import { User, UserStatus, UserSex } from '../../models/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '../../config/config.service';
import { UpdateUserInfoDto } from './dto/update-userinfo.dto';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
// import { InjectModel } from 'nestjs-typegoose';
// import { returnmodeltype } from '@typegoose/typegoose';
import { ObjectID } from 'mongodb';

import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ListDto } from './dto/list.dto';
import { ArticleService } from '../article/article.service';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleService: ArticleService,
    @InjectModel(User) public readonly userSchema: ReturnModelType<typeof User>,
  ) { };

  async getUser (id: string) {
    const user = await this.userSchema.findById(id).populate({ path: 'role', populate: 'acls' });
    return user;
  }
  async getBasiceUser (id: string) {
    const user = await this.userSchema.findById(id, '-pass')
    return user;
  }
  async update (user: User) {
    return this.userSchema.updateOne({
      _id: user._id,
    }, {
      $set: {
        ...user,
        updatedAt: Date.now()
      }
    });
  }
  async updateLoginTime (id: ObjectID) {
    return this.userSchema.updateOne({
      _id: id,
    }, {
      $set: {
        loginAt: Date.now()
      }
    });
  }
  /**
    * 更新用户信息(头像、职位、公司、个人介绍、个人主页)
    */
  async updateUserInfo (userID: ObjectID | string, updateUserInfoDto: UpdateUserInfoDto) {
    const updateData: any = {};
    if (typeof updateUserInfoDto.avatarURL !== 'undefined') {
      updateData.avatarURL = updateUserInfoDto.avatarURL;
    }
    if (typeof updateUserInfoDto.job !== 'undefined') {
      updateData.job = updateUserInfoDto.job;
    }
    if (typeof updateUserInfoDto.company !== 'undefined') {
      updateData.company = updateUserInfoDto.company;
    }
    if (typeof updateUserInfoDto.introduce !== 'undefined') {
      updateData.introduce = updateUserInfoDto.introduce;
    }
    if (typeof updateUserInfoDto.personalHomePage !== 'undefined') {
      updateData.personalHomePage = updateUserInfoDto.personalHomePage;
    }
    if (typeof updateUserInfoDto.username !== 'undefined') {
      updateData.username = updateUserInfoDto.username;
      const theUser: User = await this.userSchema.findOne({
        select: ['_id'],
        where: { username: updateData.username },
      });
      if (theUser) {
        throw new MyHttpException({
          code: ErrorCode.ParamsError.CODE,
          message: `已存在用户名为 ${updateData.username} 的用户`,
        });
      }
    }
    return this.userSchema.update({
      _id: userID,
    }, {
      $set: {
        ...updateData,
        updatedAt: Date.now()
      }
    });
  }

  async changeRole (id: string, role: string) {
    return this.userSchema.findByIdAndUpdate(id, { $set: { role: new ObjectID(role) } });
  }

  async findList (listDto: ListDto, sort: any = {}) {
    let query = {};

    listDto.page_index = Number(listDto.page_index) || 1;
    listDto.page_size = Number(listDto.page_size) || 20;

    if (listDto.keyword) {
      const keyRe = new RegExp(listDto.keyword);
      query = {
        $or: [
          { username: keyRe },
          { phone: keyRe },
          { githubLogin: keyRe },
          { githubName: keyRe },
        ]
      };
    }
    const list = await this.userSchema.find(query).sort(sort).skip((listDto.page_index - 1) * listDto.page_size).limit(listDto.page_size).populate({ path: 'role' });
    const total = await this.userSchema.countDocuments(query);
    return {
      list,
      total,
    }
  }

  async findNowLoginList () {
    const list = await this.userSchema.find({
      loginAt: {
        $ne: null
      },
    }).sort({
      loginAt: -1
    }).skip(0).limit(60).select(['_id', 'username', 'loginAt', 'avatarURL']);
    return list;
  }

  async findByPhone (phone: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      phone
    });

    if (user) {
      return user;
    }
    return undefined;
  }
  async findByPhoneOrUsername (phone: string, username: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      $or: [{ phone }, { username }]
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByObj (obj: object): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne(obj);

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByGithubId (githubID: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      githubID
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByBaiduId (baiduID: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      baiduID
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByWeiboId (weiboID: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      weiboID
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByQQId (qqID: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      qqID
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByGiteeId (giteeID: string): Promise<User | undefined> {
    const user: User = await this.userSchema.findOne({
      giteeID
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async create (signupDto: SignUpDto) {
    const newUser = new User();
    newUser.createdAt = Date.now();
    newUser.updatedAt = newUser.createdAt;
    newUser.activatedAt = newUser.createdAt;
    newUser.phone = signupDto.phone;
    newUser.username = signupDto.username.replace(/\s+/g, ''); // 用户名中不能有空格
    newUser.pass = this.generateHashPassword(signupDto.pass);
    // newUser.role = UserRole.Normal;
    newUser.status = UserStatus.Actived;
    newUser.commentCount = 0;
    newUser.sex = UserSex.Unknown;
    newUser.avatarURL = `${this.configService.static.imgPath}/avatar.jpg`;
    return this.userSchema.create(newUser);
  }

  async changeStatus (id: string, status: UserStatus) {
    return this.userSchema.findByIdAndUpdate(id, { status });
  }

  async createUser (user: User): Promise<User> {
    return await this.userSchema.create(user);
  }
  async repass (userId: ObjectID, pass: string) {
    pass = this.generateHashPassword(pass);
    return this.userSchema.update({ _id: userId }, { pass, updatedAt: Date.now() });
  }

  generateHashPassword (password: string) {
    let codeArr = _.shuffle(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
    codeArr = codeArr.slice(0, 10);
    const salt: string = codeArr.join('');
    return this.encryptPassword(password, salt, this.configService.server.passSalt);
  }

  private encryptPassword (password: string, salt: string, configSalt: string) {
    const m1 = crypto.createHash('md5');
    const pass = m1.update(password).digest('hex');
    let hash = salt + pass + configSalt;
    const m2 = crypto.createHash('md5');
    hash = salt + m2.update(hash).digest('hex');
    return hash;
  }

  verifyPassword (password: string, hashedPass: string) {
    if (!password || !hashedPass) {
      return false;
    }
    const salt = hashedPass.substr(0, 10);
    return this.encryptPassword(password, salt, this.configService.server.passSalt) === hashedPass;
  }

  achievement (id: ObjectID | string) {
    const oid = new ObjectID(id);
    return this.articleService.statistics(oid);
  }

}
