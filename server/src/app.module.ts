import { Module, MiddlewareConsumer, NestModule, RequestMethod, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';

// import { CommonModule } from './common/common.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './modules/user/user.module';
import { UserMiddleware } from './core/middleware/user.middleware';
import { OauthModule } from './oauth/oauth.module';
import { CommentModule } from './modules/comment/comment.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommonModule } from './common/common.module';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { RoleModule } from './modules/role/role.module';
import { LinksModule } from './modules/links/links.module';
import { OpenapiModule } from './openapi/openapi.module';
import { KeywordsModule } from './modules/keywords/keywords.module';
import { KeywordsService } from './modules/keywords/keywords.service';
import { TasksModule } from './common/tasks/tasks.module';
import { DataModule } from './modules/data/data.module';
import { NotifyModule } from './modules/notify/notify.module';
import { AuthModule } from './modules/auth/auth.module';
import { GatewayModule } from './modules/gateway/gateway.module';
// import { TransferModule } from './modules/transfer/transfer.module';

@Module({
  imports: [
    // NestConfigModule.forRoot({
    //   envFilePath: process.env.NODE_ENV === 'development' ? '.env' : '.env.prod'
    // }),
    ConfigModule.forRootAsync(),
    TypegooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.mongodb;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        // typeorm bug, https://github.com/nestjs/nest/issues/1119
        // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
        console.log('configService.mysql',configService.mysql);

        return {
          ...configService.mysql,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<ConfigService> => {
        return configService;
      },
      inject: [ConfigService],
    }),
    CommonModule,
    OauthModule,
    UserModule,
    CommentModule,
    ArticleModule,
    TagModule,
    RoleModule,
    LinksModule,
    OpenapiModule,
    TasksModule,
    KeywordsModule,
    DataModule,
    NotifyModule,
    AuthModule,
    GatewayModule,
    // TransferModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(
    // private readonly configService: ConfigService,
    // private readonly tasksService: TasksService
    private readonly keywordsService: KeywordsService
  ) { }

  configure (consumer: MiddlewareConsumer) {
    const middlewares = [
      UserMiddleware
    ];
    consumer
      .apply(...middlewares)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  onApplicationBootstrap () {
    this.keywordsService.generateKeywordsCloud()
  }
}
