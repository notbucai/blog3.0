import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import pinyin from 'pinyin';


import { User as UserEntity } from '../../models/user.entity';
import { Acl as AclEntity } from '../../models/acl.entity';
import { Article as ArticleEntity } from '../../models/article.entity';
import { ArticleRead as ArticleReadEntity } from '../../models/article.read.entity';
import { Keywords as KeywordsEntity } from '../../models/keywords.entity';
import { Link as LinkEntity } from '../../models/links.entity';
import { Notify as NotifyEntity } from '../../models/notify.entiy';
import { Role as RoleEntity } from '../../models/role.entity';
import { Tag as TagEntity } from '../../models/tag.entity';
import { MessageComment as MessageCommentEntity, ArticleComment as ArticleCommenttEntity } from '../../models/comment.entity';


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

export enum ConenteStatus {
  Verifying = 1, // 审核中
  VerifySuccess = 2, // 审核通过
  VerifyFail = 3, // 审核未通过
}

export enum UserStatus {
  InActive = 1, // 未激活
  Actived = 2, // 已激活
  Frozen = 3, // 已冻结
}

export enum UserSex {
  Male = 0, // 男
  Female = 1, // 女
  Unknown = 2, // 未知
}

export enum NotifyStatus {
  read = 1,
  new = 0,
}

export const newNotifyStatus = {
  [NotifyStatus.read]: 'Read',
  [NotifyStatus.new]: 'New',
}

export const newContentStatus = {
  [ConenteStatus.Verifying]: 'Verifying', // 审核中
  [ConenteStatus.VerifySuccess]: 'VerifySuccess', // 审核通过
  [ConenteStatus.VerifyFail]: 'VerifyFail', // 审核未通过
}

const newUserStatus = {
  [UserStatus.InActive]: "InActive", // 未激活
  [UserStatus.Actived]: "Actived", // 已激活
  [UserStatus.Frozen]: "Frozen", // 已冻结
};

export const newUserSex = {
  [UserSex.Male]: 'Male', // 男
  [UserSex.Female]: 'Female', // 女
  [UserSex.Unknown]: 'Unknown', // 未知
}



@Injectable()
export class TransferService {

  constructor(
    @InjectModel(UserEntity) public readonly userSchema: ReturnModelType<typeof UserEntity>,
    @InjectModel(AclEntity) public readonly aclSchema: ReturnModelType<typeof AclEntity>,
    @InjectModel(ArticleEntity) public readonly articleSchema: ReturnModelType<typeof ArticleEntity>,
    @InjectModel(ArticleReadEntity) public readonly articleReadSchema: ReturnModelType<typeof ArticleReadEntity>,
    @InjectModel(KeywordsEntity) public readonly keywordsSchema: ReturnModelType<typeof KeywordsEntity>,
    @InjectModel(LinkEntity) public readonly linkSchema: ReturnModelType<typeof LinkEntity>,
    @InjectModel(NotifyEntity) public readonly notifySchema: ReturnModelType<typeof NotifyEntity>,
    @InjectModel(RoleEntity) public readonly roleSchema: ReturnModelType<typeof RoleEntity>,
    @InjectModel(TagEntity) public readonly tagSchema: ReturnModelType<typeof TagEntity>,
    @InjectModel(MessageCommentEntity) public readonly messageCommentSchema: ReturnModelType<typeof MessageCommentEntity>,
    @InjectModel(ArticleCommenttEntity) public readonly articleCommenttSchema: ReturnModelType<typeof ArticleCommenttEntity>,

    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectRepository(Acl) private aclRepository: Repository<Acl>,
    // @InjectRepository(Article) private articleRepository: Repository<Article>,
    // @InjectRepository(ArticleComment) private articleCommentRepository: Repository<ArticleComment>,
    // @InjectRepository(ArticleCommentLike) private articleCommentLikeRepository: Repository<ArticleCommentLike>,
    // @InjectRepository(ArticleLike) private articleLikeRepository: Repository<ArticleLike>,
    // @InjectRepository(ArticleMenu) private articleMenuRepository: Repository<ArticleMenu>,
    // @InjectRepository(ArticleRead) private articleReadRepository: Repository<ArticleRead>,
    // @InjectRepository(ArticleTag) private articleTagRepository: Repository<ArticleTag>,
    // @InjectRepository(Keyword) private keywordRepository: Repository<Keyword>,
    // @InjectRepository(KeywordUse) private keywordUseRepository: Repository<KeywordUse>,
    // @InjectRepository(LeaveWord) private leaveWordRepository: Repository<LeaveWord>,
    // @InjectRepository(LeaveWordLike) private leaveWordLikeRepository: Repository<LeaveWordLike>,
    // @InjectRepository(Link) private linkRepository: Repository<Link>,
    // @InjectRepository(LinkClick) private linkClickRepository: Repository<LinkClick>,
    // @InjectRepository(Notifies) private notifiesRepository: Repository<Notifies>,
    // @InjectRepository(Role) private roleRepository: Repository<Role>,
    // @InjectRepository(RoleAcl) private roleAclRepository: Repository<RoleAcl>,
    // @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    // @InjectRepository(UserLink) private userLinkRepository: Repository<UserLink>,
    // @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,

    private readonly dataSource: DataSource,

  ) { }

  genUUIDByObjectId(objectId: string) {
    const seedRen = objectId
      .replace(/-/g, '')
      .split('')
      .reduce((pv, cv, index) => {
        pv[(index / 2) | 0] = (pv[(index / 2) | 0] || '') + cv;
        return pv;
      }, [])
      .map(item => parseInt('0x' + item, 16) || 0)
      .concat([0xf5, 0xf4, 0xf2, 0xf6]);
    return uuid.v4({
      random: seedRen
    });
  }

  async run() {
    // data list
    const users = await this.userSchema.find();
    const acls = await this.aclSchema.find();
    const articles = await this.articleSchema.find();
    const articleReads = await this.articleReadSchema.find();
    const keywordss = await this.keywordsSchema.find();
    const links = await this.linkSchema.find();
    const notifys = await this.notifySchema.find();
    const roles = await this.roleSchema.find();
    const tags = await this.tagSchema.find();
    const messageComments = await this.messageCommentSchema.find();
    const articleCommentts = await this.articleCommenttSchema.find();
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.startTransaction()
      // 清空表
      // queryRunner.manager.remove()
      // 权限点
      const mAcls = acls.map(item => {
        const a = new Acl();
        a.code = item.name;
        a.name = item.title;
        a.id = this.genUUIDByObjectId(item._id.toString());
        return a;
      });

      await queryRunner.manager.save(mAcls);

      const mRoles = roles.map(item => {
        const a = new Role();
        a.id = this.genUUIDByObjectId(item._id.toString());
        a.name = item.name;
        a.code = pinyin(item.name, {
          style: 'normal'
        }).join('_');
        return a;
      });
      await queryRunner.manager.save(mRoles);

      const mRoleAcls = roles.reduce((pv, item) => {
        const roleId = this.genUUIDByObjectId(item._id.toString());
        if (Array.isArray(item.acls)) {
          item.acls.forEach(id => {
            const a = new RoleAcl();
            a.roleId = roleId;
            a.aclId = this.genUUIDByObjectId(`${id}`);
          })
        }
        return pv;
      }, []);
      await queryRunner.manager.save(mRoleAcls);

      const mLinks = links.reduce((pv, item) => {
        const a = new Link();
        a.id = this.genUUIDByObjectId(item._id.toString());
        a.title = item.title;
        a.url = item.url;
        a.logo = item.logo;
        a.intro = item.intro;
        a.createAt = new Date(item.createdAt);
        pv.push(a)
        return pv;
      }, []);
      await queryRunner.manager.save(mLinks);
      await queryRunner.manager.save(mLinks);

      const mTags = tags.reduce((pv, item) => {
        const a = new Tag();
        a.id = this.genUUIDByObjectId(item._id.toString());
        a.icon = item.iconURL;
        a.name = item.name;
        a.createAt = new Date(item.createdAt);
        pv.push(a)
        return pv;
      }, []);
      await queryRunner.manager.save(mTags);

      const mKeywords = keywordss.reduce((pv, item) => {
        const a = new Keyword();
        a.id = this.genUUIDByObjectId(item._id.toString());
        a.content = item.value;
        a.count = item.count;
        a.createAt = new Date(item.createdAt);
        pv.push(a)
        return pv;
      }, []);
      await queryRunner.manager.save(mKeywords);

      const mUsers = users.reduce((pv, item) => {
        const a = new User();
        a.id = this.genUUIDByObjectId(item._id.toString());
        a.isAdmin = Number(!!item.isAdmin);
        a.username = item.username;
        a.avatarUrl = item.avatarURL;
        a.status = newUserStatus[item.status];
        a.email = item.email;
        a.introduce = item.numberroduce;
        a.website = item.personalHomePage;
        a.pass = item.pass;
        a.phone = item.phone;
        a.loginAt = item.loginAt ? new Date(item.loginAt || Date.now()) : undefined
        a.createAt = new Date(item.createdAt);
        pv.push(a)
        return pv;
      }, []);
      await queryRunner.manager.save(mUsers);
      await queryRunner.manager.save(mUsers);

      const mUserRole = users.reduce((pv, item) => {
        if (!item.role) return pv;
        const a = new UserRole();
        a.roleId = this.genUUIDByObjectId(`${item.role}`)
        a.userId = this.genUUIDByObjectId(`${item._id}`);
        pv.push(a)
        return pv;
      }, []);
      await queryRunner.manager.save(mUserRole);

      const mUserLinks = users.reduce((pv, item) => {
        const keyMap = [
          {
            loginId: item.githubID,
            loginName: item.githubLogin,
            loginAvatar: item.githubAvatarURL,
            type: 'github',
          },
          {
            loginId: item.qqID,
            loginName: item.qqName,
            loginAvatar: item.qqAvatar,
            type: 'qq',
          },
          {
            loginId: item.giteeID,
            loginName: item.giteeName,
            loginAvatar: item.giteeAvatar,
            loginEmail: item.giteeEmail,
            type: 'gitee',
          },
          {
            loginId: item.baiduID,
            loginName: item.baiduName,
            loginAvatar: item.baiduAvatarLarge,
            type: 'baidu',
          },
          {
            loginId: item.weiboID,
            loginName: item.weiboName,
            loginAvatar: item.weiboAvatarURL,
            type: 'weibo'
          },
          {
            loginId: item.notbucaiID,
            loginName: item.notbucaiNickname,
            loginAvatar: item.notbucaiAvatarUrl,
            loginOpenid: item.notbucaiOpenid,
            type: 'notbucai'
          },
        ];

        keyMap.filter(k => k.loginId).forEach(v => {
          const a = new UserLink();
          Object.keys(v).forEach(k => {
            a[k] = v[k]
          });
          a.userId = this.genUUIDByObjectId(item._id.toString());
          pv.push(a)
        });
        return pv;
      }, []);
      await queryRunner.manager.save(mUserLinks);

      const mArticles = articles.reduce((pv, item) => {
        const a = new Article();
        a.id = this.genUUIDByObjectId(item._id.toString());
        a.content = item.content;
        a.htmlContent = item.htmlContent;
        a.coverUrl = item.coverURL;
        a.status = newContentStatus[item.status];
        a.summary = item.summary;
        a.title = item.title;
        a.userId = this.genUUIDByObjectId(`${item.user}`);
        a.wordCount = item.wordCount || 0;
        a.createAt = new Date(item.createdAt);
        a.updateAt = new Date(item.updatedAt);
        
        a.browseCount = item.browseCount || 0;
        pv.push(a)
        return pv;
      }, []);
      console.log('mArticles', mArticles);
      await queryRunner.manager.save(mArticles);
      await queryRunner.manager.save(mArticles);

      const mArticleMenu = articles.reduce((pv, item) => {
        item.menus?.map(m => {
          const a = new ArticleMenu();
          a.title = m.title;
          a.type = m.type;
          a.target = m.target;
          a.articleId = this.genUUIDByObjectId(`${item._id}`)
          pv.push(a)
        })
        return pv;
      }, []);
      await queryRunner.manager.save(mArticleMenu);

      const mArticleTag = articles.reduce((pv, item) => {
        item.tags?.map(t => {
          const a = new ArticleTag();
          a.tagId = this.genUUIDByObjectId(`${t}`);
          a.articleId = this.genUUIDByObjectId(`${item._id}`);
          pv.push(a)
        })
        return pv;
      }, []);
      await queryRunner.manager.save(mArticleTag);

      const mArticleLikes = articles.reduce((pv, item) => {
        item.likes?.forEach(l => {
          const a = new ArticleLike();
          a.objectId = this.genUUIDByObjectId(`${item._id}`);
          a.userId = this.genUUIDByObjectId(`${l}`)
          pv.push(a);
        });
        return pv;
      }, []);
      await queryRunner.manager.save(mArticleLikes);

      // notifys
      const mNotifys = notifys.reduce((pv, item) => {
        if (!item.sender || !item.recipient) return pv;
        const a = new Notifies()
        a.id = this.genUUIDByObjectId(`${item._id}`)
        a.objectId = this.genUUIDByObjectId(`${item.objectID}`)
        a.content = item.object;
        a.message = item.message;
        a.recipientId = this.genUUIDByObjectId(`${item.recipient}`)
        a.senderId = this.genUUIDByObjectId(`${item.sender}`)
        a.senderAction = item.senderAction;
        a.status = newNotifyStatus[item.status] as any;
        a.readAt = item.readAt ? new Date(item.readAt) : undefined;
        a.createAt = new Date(item.createdAt);
        if (
          mUsers.findIndex(u => u.id === a.senderId) === -1 ||
          mUsers.findIndex(u => u.id === a.recipientId) === -1
        ) {
          return pv;
        }
        pv.push(a);
        return pv;
      }, []);
      await queryRunner.manager.save(mNotifys);
      await queryRunner.manager.save(mNotifys);

      // messageComments
      const mLeaveWords = messageComments.reduce((pv, item) => {
        const a = new LeaveWord()
        a.id = this.genUUIDByObjectId(`${item._id}`);

        a.rootId = item.rootID && this.genUUIDByObjectId(`${item.rootID}`)
        a.userId = this.genUUIDByObjectId(`${item.user}`)
        a.parentId = item.parent && this.genUUIDByObjectId(`${item.parent}`)
        a.content = item.content;
        a.htmlContent = item.htmlContent;
        a.status = newContentStatus[item.status]
        a.createAt = new Date(item.createdAt);
        pv.push(a);
        return pv;
      }, []);
      // return
      const x = mLeaveWords.sort((a, b) => {
        if (Number(Boolean(a.parentId)) < Number(Boolean(b.id))) {
          return -1;
        }
        if (Number(Boolean(a.rootId)) < Number(Boolean(b.id))) {
          return -1;
        }
        return 1;
      }).filter(item => {
        return (item.parentId ? mLeaveWords.find(ii => ii.id === item.parentId) : true) && (item.rootId ? mLeaveWords.find(ii => ii.id === item.rootId) : true)
      });
      await queryRunner.manager.save(x, { chunk: 1 });
      await queryRunner.manager.save(x, { chunk: 1 });

      const mLeaveWordLikes = messageComments.reduce((pv, item) => {
        item.likes?.map(l => {
          const a = new LeaveWordLike()
          a.objectId = this.genUUIDByObjectId(`${item._id}`);
          a.userId = this.genUUIDByObjectId(`${l}`);
          pv.push(a);
        });
        return pv;
      }, []);
      await queryRunner.manager.save(mLeaveWordLikes);

      const mArticleComments = articleCommentts.reduce((pv, item) => {
        const a = new ArticleComment()
        a.id = this.genUUIDByObjectId(`${item._id}`);

        a.rootId = item.rootID && this.genUUIDByObjectId(`${item.rootID}`)
        a.userId = this.genUUIDByObjectId(`${item.user}`)
        a.parentId = item.parent && this.genUUIDByObjectId(`${item.parent}`)
        a.content = item.content;
        a.htmlContent = item.htmlContent;
        a.status = newContentStatus[item.status]
        a.objectId = item.sourceID && this.genUUIDByObjectId(`${item.sourceID}`)
        a.createAt = new Date(item.createdAt);
        pv.push(a);
        return pv;
      }, []);
      const a = mArticleComments.sort((a, b) => {
        if (Number(Boolean(a.parentId)) < Number(Boolean(b.id))) {
          return -1;
        }
        if (Number(Boolean(a.rootId)) < Number(Boolean(b.id))) {
          return -1;
        }
        return 1;
      }).filter(item => {
        return (item.parentId ? mArticleComments.find(ii => ii.id === item.parentId) : true) && (item.rootId ? mArticleComments.find(ii => ii.id === item.rootId) : true)
      });
      await queryRunner.manager.save(a);
      await queryRunner.manager.save(a);

      const mArticleCommentLikes = articleCommentts.reduce((pv, item) => {
        item.likes?.map(l => {
          const a = new ArticleCommentLike()
          a.objectId = this.genUUIDByObjectId(`${item._id}`);
          a.userId = this.genUUIDByObjectId(`${l}`);
          pv.push(a);
        });
        return pv;
      }, []);
      await queryRunner.manager.save(mArticleCommentLikes);

      const mArticleReads = articleReads.reduce((pv, item) => {

        const a = new ArticleRead()
        a.id = this.genUUIDByObjectId(`${item._id}`)
        a.articleId = this.genUUIDByObjectId(`${item.article}`);
        a.ip = item.ip;
        a.createAt = new Date(item.createdAt);
        if (mArticles.findIndex(aa => aa.id === a.articleId) !== -1) {
          pv.push(a);
        }
        return pv;
      }, []);

      await queryRunner.manager.save(mArticleReads);

      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

  }

}
