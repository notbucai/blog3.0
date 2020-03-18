import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as _ from 'lodash';

import { User, UserRole, UserStatus, UserSex } from '../../entity/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) { };
  
  getUser(id: string): any {
    return { id };
  }

  async findByPhoneOrUsername(phone: string, username: string): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({
      select: [
        'username', 'phone'
      ],
      where: {
        $or: [{ phone }, { username }]
      },
    });
    console.log('user=>', user);

    if (user) {
      return user;
    }
    return undefined;
  }

  async create(signupDto: SignUpDto): Promise<User> {
    const newUser = new User();
    newUser.createdAt = new Date();
    newUser.updatedAt = newUser.createdAt;
    newUser.activatedAt = newUser.createdAt;
    newUser.phone = signupDto.phone;
    newUser.username = signupDto.username.replace(/\s+/g, ''); // 用户名中不能有空格
    newUser.pass = this.generateHashPassword(signupDto.pass);
    newUser.role = UserRole.Normal;
    newUser.status = UserStatus.Actived;
    newUser.commentCount = 0;
    newUser.sex = UserSex.Unknown;
    newUser.avatarURL = `${this.configService.static.imgPath}/avatar.jpg`;
    return await this.userRepository.save(newUser);
  }

  generateHashPassword(password) {
    let codeArr = _.shuffle(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
    codeArr = codeArr.slice(0, 10);
    const salt: string = codeArr.join('');
    return this.encryptPassword(password, salt, this.configService.server.passSalt);
  }

  private encryptPassword(password, salt, configSalt) {
    const m1 = crypto.createHash('md5');
    const pass = m1.update(password).digest('hex');
    let hash = salt + pass + configSalt;
    const m2 = crypto.createHash('md5');
    hash = salt + m2.update(hash).digest('hex');
    return hash;
  }

  verifyPassword(password, hashedPass) {
    if (!password || !hashedPass) {
      return false;
    }
    const salt = hashedPass.substr(0, 10);
    return this.encryptPassword(password, salt, this.configService.server.passSalt) === hashedPass;
  }

}
