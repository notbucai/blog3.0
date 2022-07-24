import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as _ from 'lodash';

import { User, UserStatus, UserSex } from '../../models/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '../../config/config.service';
import { UpdateUserInfoDto } from './dto/update-userinfo.dto';
import { MyHttpException } from '../../core/exception/http.exception';
import { ErrorCode } from '../../constants/error';
// import { InjectModel } from 'nestjs-typegoose';
// import { returnmodeltype } from '@typegoose/typegoose';
import { ObjectID } from 'mongodb';

import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ListDto } from './dto/list.dto';
import { ArticleService } from '../article/article.service';
import { DateType } from '../../constants/constants';
import moment = require('moment');
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository, IsNull } from 'typeorm';
import { User as UserEntity } from '../../entities/User';
import { UserLink as UserLinkEntity } from '../../entities/UserLink';
import { UserRole as UserRoleEntity } from '../../entities/UserRole';
import { StateEnum } from '../../oauth/oauth.constant';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleService: ArticleService,
    @InjectModel(User) public readonly userSchema: ReturnModelType<typeof User>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserLinkEntity)
    private userLinkRepository: Repository<UserLinkEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) { };

  // async t(){
  //   const d = await this.userRepository.findOne( {
  //     relations: ['userRoles', 'userRoles.role', 'userRoles.role.roleAcls']
  //   });
  //   console.log('d---', d);
  // }
  async getUser(id: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.roleAcls']
    });
    return user;
  }
  async getBasicUser(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    return user;
  }
  async update(user: UserEntity) {
    return this.userRepository.save(user);
  }
  async updateLoginTime(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    user.loginAt = new Date();
    return this.userRepository.save(user);
  }
  /**
    * 更新用户信息(头像、职位、公司、个人介绍、个人主页)
    */
  async updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto) {
    const updateData = await this.userRepository.findOneByOrFail({ id: userId });
    if (typeof updateUserInfoDto.avatarUrl !== 'undefined') {
      updateData.avatarUrl = updateUserInfoDto.avatarUrl;
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
      updateData.website = updateUserInfoDto.personalHomePage;
    }
    if (typeof updateUserInfoDto.username !== 'undefined') {
      updateData.username = updateUserInfoDto.username;
      const theUser: UserEntity = await this.userRepository.findOneOrFail({
        where: { username: updateData.username },
      });
      if (theUser) {
        throw new MyHttpException({
          code: ErrorCode.ParamsError.CODE,
          message: `已存在用户名为 ${updateData.username} 的用户`,
        });
      }
    }
    return this.userRepository.save(updateData);
  }

  async changeRole(id: string, roleId: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    const userRole = new UserRoleEntity();
    userRole.roleId = roleId;
    userRole.userId = user.id;
    user.userRoles = [userRole];

    return this.userRepository.save(user);
  }

  async findList(listDto: ListDto, order: 'DESC' | 'ASC' = 'DESC') {
    let query = {};

    listDto.page_index = Number(listDto.page_index) || 1;
    listDto.page_size = Number(listDto.page_size) || 20;

    if (listDto.keyword) {
      const keyLike = Like(`%${listDto.keyword}%`)
      query = [
        { username: keyLike },
        { phone: keyLike },
      ];
    }
    const list = await this.userRepository
      .find({
        where: query,
        order: {
          createAt: order
        },
        skip: (listDto.page_index - 1) * listDto.page_size,
        take: listDto.page_size,
        relations: ['userRoles', 'userRoles.role', 'userRoles.role.roleAcls'],
      })
    // .createQueryBuilder()
    // .where(query)
    // .addOrderBy('User_create_at', order)
    // .addSelect('createAt', 'createAt')
    // .offset((listDto.page_index - 1) * listDto.page_size)
    // .limit(listDto.page_size)
    // .leftJoinAndSelect('User.userRoles', 'userRoles')
    // .leftJoinAndSelect('User.userRoles.role', 'role')
    // .leftJoinAndSelect('User.userRoles.roleAcls', 'roleAcls')
    // .getMany()
    const total = await this.userRepository
      .createQueryBuilder()
      .where(query)
      .getCount();
    return {
      list,
      total,
    }
  }

  async findNowLoginList() {
    const list = await this.userRepository
      .createQueryBuilder()
      .where({
        loginAt: Not(IsNull()),
      })
      .orderBy({
        login_at: 'DESC'
      })
      .take(60)
      .getMany()
    return list;
  }

  async findByPhone(phone: string): Promise<UserEntity | undefined> {
    const user: UserEntity = await this.userRepository.findOneBy({
      phone
    });

    if (user) {
      return user;
    }
    return undefined;
  }
  async findByPhoneOrUsername(phone: string, username: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: [{ phone }, { username }]
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByObj(obj: object) {
    const user = await this.userRepository.findOne({
      where: obj,
    });

    if (user) {
      return user;
    }
    return undefined;
  }

  async findByUnSafeObj(obj: object) {
    const user = await this.userRepository
      .createQueryBuilder()
      .where(obj)
      .addSelect('User.pass')
      .getOne();

    if (user) {
      return user;
    }
    return undefined;
  }

  async findLinkByUserId(type: StateEnum, userId: string) {
    const userLink = await this.userLinkRepository.findOne({
      where: {
        type,
        userId
      },
      // relations: ['user']
    });
    return userLink;
  }

  async findUserByLinkLoginId(type: StateEnum, loginId: string) {
    const userLink = await this.userLinkRepository.findOne({
      where: {
        type,
        loginId
      },
      relations: ['user']
    });
    return userLink?.user;
  }

  async updateLink(userLink: UserLinkEntity) {
    return this.userLinkRepository.save(userLink);
  }

  // 账户关联列表信息
  async findUserLinkList(uid: string) {
    return this.userLinkRepository.findBy({
      userId: uid
    });
  }

  async create(signupDto: SignUpDto) {
    const newUser = new UserEntity();
    newUser.activateAt = newUser.activateAt;
    newUser.phone = signupDto.phone;
    newUser.username = signupDto.username.replace(/\s+/g, ''); // 用户名中不能有空格
    newUser.pass = this.generateHashPassword(signupDto.pass);
    // newUser.role = UserRole.Normal;
    newUser.status = UserStatus.Actived;
    newUser.sex = UserSex.Unknown;
    newUser.avatarUrl = `${this.configService.static.imgPath}/avatar.jpg`;
    return this.userRepository.save(newUser);
  }

  async changeStatus(id: string, status: UserStatus) {
    const user = await this.userRepository.findOneByOrFail({ id });
    user.status = status;
    this.userRepository.save(user);
  }

  async createUser(user: UserEntity) {
    return this.userRepository.save(user);
  }
  async repass(userId: string, pass: string) {
    pass = this.generateHashPassword(pass);
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    user.pass = pass;
    return this.userRepository.save(user);
  }

  generateHashPassword(password: string) {
    let codeArr = _.shuffle(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
    codeArr = codeArr.slice(0, 10);
    const salt: string = codeArr.join('');
    return this.encryptPassword(password, salt, this.configService.server.passSalt);
  }

  private encryptPassword(password: string, salt: string, configSalt: string) {
    const m1 = crypto.createHash('md5');
    const pass = m1.update(password).digest('hex');
    let hash = salt + pass + configSalt;
    const m2 = crypto.createHash('md5');
    hash = salt + m2.update(hash).digest('hex');
    return hash;
  }

  verifyPassword(password: string, hashedPass: string) {
    if (!password || !hashedPass) {
      return false;
    }
    const salt = hashedPass.substring(0, 10);    
    return this.encryptPassword(password, salt, this.configService.server.passSalt) === hashedPass;
  }

  achievement(id: string) {
    const oid = id;
    return this.articleService.statistics(oid);
  }

  async growthData(type: DateType = DateType.day, size: number = 30) {

    const schema = this.userSchema

    const date = moment();
    const list = [];
    for (let i = 0; i < size; i++) {

      const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');
      const endDate = moment(startDate).add(1, type).format('YYYY-MM-DD');

      const findPromise = schema.countDocuments({
        createAt: {
          $gte: new Date(startDate + (type === DateType.day ? '' : '-01') + ' 00:00:00'),
          $lt: new Date(endDate + ' 23:59:59'),
        }
      });

      list.push(findPromise.then(data => {
        return {
          date: startDate,
          count: data,
        }
      }));
      date.subtract(1, type);
    }
    return Promise.all(list);
  }

  async historyData(type: DateType = DateType.day, size: number = 30) {

    const schema = this.userSchema

    const date = moment();
    const list = [];
    for (let i = 0; i < size; i++) {

      const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');

      const findPromise = schema.countDocuments({
        createAt: {
          $gte: new Date(startDate + (type === DateType.day ? '' : '-30') + ' 23:59:59'),
        }
      });

      list.push(findPromise.then(data => {
        return {
          date: startDate,
          count: data,
        }
      }));
      date.subtract(1, type);
    }
    return Promise.all(list);
  }

  userTypeData() {
    const types = ['github', 'gitee', 'baidu', 'weibo', 'qq', 'notbucai'];
    const schema = this.userSchema;

    const list = types.map(type => {
      const countPromise = schema.countDocuments({
        [type + 'ID']: { $exists: true }
      });
      return countPromise.then(res => {
        return {
          type,
          count: res,
        }
      });
    });

    return Promise.all(list);
  }

  async authorData(size: number = 10) {
    const list = await this.userSchema.aggregate([
      {
        $lookup:
        {
          from: 'articles',
          localField: '_id',
          foreignField: 'user',
          as: 'articles'
        },
      },
      { $project: { _id: 1, username: 1, count: { $size: '$articles' } } },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: size
      }
    ]);

    return list;
  }

  count() {
    return this.userRepository.count()
  }
}
