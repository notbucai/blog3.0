import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User as UserEntity } from '../../models/user.entity';
import { Acl as AclEntity } from '../../models/acl.entity';
import { Article as ArticleEntity } from '../../models/article.entity';
import { ArticleRead as ArticleReadEntity } from '../../models/article.read.entity';
import { MessageComment as MessageCommentEntity, ArticleComment as ArticleCommenttEntity } from '../../models/comment.entity';
import { Keywords as KeywordsEntity } from '../../models/keywords.entity';
import { Link as LinkEntity } from '../../models/links.entity';
import { Notify as NotifyEntity } from '../../models/notify.entiy';
import { Role as RoleEntity } from '../../models/role.entity';
import { Tag as TagEntity } from '../../models/tag.entity';

import { User } from '../../entities/User';
import { Acl } from '../../entities/Acl';
import { Article } from '../../entities/Article';
import { ArticleComment } from '../../entities/ArticleComment';
import { ArticleCommentLike } from '../../entities/ArticleCommentLike';
import { ArticleLike } from '../../entities/ArticleLike';
import { ArticleMenu } from '../../entities/ArticleMenu';
import { ArticleRead } from '../../entities/ArticleRead';
import { ArticleTag } from '../../entities/ArticleTag';
import { Keyword } from '../../entities/Keyword';
import { KeywordUse } from '../../entities/KeywordUse';
import { LeaveWord } from '../../entities/LeaveWord';
import { LeaveWordLike } from '../../entities/LeaveWordLike';
import { Link } from '../../entities/Link';
import { LinkClick } from '../../entities/LinkClick';
import { Notifies } from '../../entities/Notifies';
import { Role } from '../../entities/Role';
import { RoleAcl } from '../../entities/RoleAcl';
import { Tag } from '../../entities/Tag';
import { UserLink } from '../../entities/UserLink';
import { UserRole } from '../../entities/UserRole';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      UserEntity, AclEntity, ArticleEntity, ArticleReadEntity, MessageCommentEntity, ArticleCommenttEntity, KeywordsEntity, LinkEntity, NotifyEntity, RoleEntity, TagEntity
    ]),
    TypeOrmModule.forFeature([
      User, Acl, Article, ArticleComment, ArticleCommentLike, ArticleLike, ArticleMenu, ArticleRead, ArticleTag, Keyword, KeywordUse, LeaveWord, LeaveWordLike, Link, LinkClick, Notifies, Role, RoleAcl, Tag, UserLink, UserRole
    ]),
    CommentModule
  ],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule { }
