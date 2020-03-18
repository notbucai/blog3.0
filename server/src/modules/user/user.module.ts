import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../../common/common.module';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      User,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule { }
