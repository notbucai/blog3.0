import { Injectable } from '@nestjs/common';
import { Repository, LessThan, In, Like, MoreThan, Between, IsNull } from 'typeorm';
import { ObjectID } from 'mongodb';
import { MessageComment, ArticleComment, Comment } from '../../models/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentConstants } from '../../constants/comment';
import { CreateCommentDto } from './dto/create.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Article } from '../../models/article.entity';
import { User } from '../../models/user.entity';
import { AllListDto } from './dto/allList.dto';
import { MyHttpException } from '../../core/exception/http.exception';
import { ErrorCode } from '../../constants/error';
import { NotifyActionType, NotifyObjectType } from '../../models/notify.entiy';
import { NotifyService } from '../notify/notify.service';
import { ArticleService } from '../article/article.service';
import MarkDownUtils from '../../utils/markdown'
import { ContentStatus, ContentStatusLabelMap, DateType, systemObjectId } from '../../constants/constants';
import moment = require('moment');
import { CensorService } from '../../common/censor.service';

import { LeaveWord } from '../../entities/LeaveWord';
import { LeaveWordLike } from '../../entities/LeaveWordLike';
import { ArticleComment as ArticleCommentEntity } from '../../entities/ArticleComment';
import { ArticleCommentLike } from '../../entities/ArticleCommentLike';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(LeaveWord)
    private readonly leaveWordRepository: Repository<LeaveWord>,
    @InjectRepository(ArticleCommentEntity)
    private readonly articleCommentRepository: Repository<ArticleCommentEntity>,

    @InjectRepository(LeaveWordLike)
    private readonly leaveWordLikeRepository: Repository<LeaveWordLike>,
    @InjectRepository(ArticleCommentLike)
    private readonly articleCommentLikeRepository: Repository<ArticleCommentLike>,

    @InjectModel(ArticleComment) public readonly articleCommentSchema: ReturnModelType<typeof ArticleComment>,
    @InjectModel(MessageComment) public readonly messageCommentSchema: ReturnModelType<typeof MessageComment>,


    private readonly notifyService: NotifyService,
    private readonly articleService: ArticleService,
    private readonly censorService: CensorService,
  ) { }

  private getCommentSchema(source: string) {
    let commentRepository: Repository<LeaveWord | ArticleCommentEntity>;
    if (source === CommentConstants.SourceArticle) {
      commentRepository = this.articleCommentRepository;
    } else if (source === CommentConstants.SourceMessage) {
      commentRepository = this.leaveWordRepository;
    }
    return commentRepository;
  }

  private getCommentLikeSchema(source: string) {
    let commentRepository: Repository<LeaveWordLike | ArticleCommentLike>;
    if (source === CommentConstants.SourceArticle) {
      commentRepository = this.articleCommentLikeRepository;
    } else if (source === CommentConstants.SourceMessage) {
      commentRepository = this.leaveWordLikeRepository;
    }
    return commentRepository;
  }

  private getCommentEntity(source: string) {
    let entity: LeaveWord | ArticleCommentEntity;
    if (source === CommentConstants.SourceArticle) {
      entity = new ArticleCommentEntity();
    } else if (source === CommentConstants.SourceMessage) {
      entity = new LeaveWord();
    }
    return entity;
  }

  private getCommentLikeEntity(source: string) {
    let entity: ArticleCommentLike | LeaveWordLike;
    if (source === CommentConstants.SourceArticle) {
      entity = new ArticleCommentLike();
    } else if (source === CommentConstants.SourceMessage) {
      entity = new LeaveWordLike();
    }
    return entity;
  }

  async censor(source: string, id: string) {
    const schema = this.getCommentSchema(source)
    const object = await schema.findOneByOrFail({ id })

    const content = object.content;

    const data = await this.censorService.applyBasic(content)
    if (data.status) {
      return this.changeStatus(source, id, ContentStatus.VerifySuccess)
    }

    if (data.type === 2) {
      return this.changeStatus(source, id, ContentStatus.VerifyFail)
    }
  }
  /**
   * 创建评论
   */
  async create(source: string, createCommentDto: CreateCommentDto, userId: string) {
    const commentRepository = this.getCommentSchema(source);
    // sourceId 文章的时候是文章id 
    // parentId 表示父级评论id
    // rootId 表示一级评论  不填为一级

    const comment = this.getCommentEntity(source);
    if (createCommentDto.rootId) {
      comment.rootId = createCommentDto.rootId;
    }
    if (createCommentDto.parentId) {
      comment.parentId = createCommentDto.parentId;
    }
    if (createCommentDto.sourceId && comment instanceof ArticleCommentEntity) {
      comment.objectId = createCommentDto.sourceId;
    }

    const htmlContent = MarkDownUtils.markdown(createCommentDto.content);

    comment.status = ContentStatus.VerifySuccess;
    comment.userId = userId;
    comment.content = createCommentDto.content;
    comment.htmlContent = htmlContent;

    return commentRepository.save(comment);
  }
  async getUserIdBySourceId(source: CommentConstants, id: string): Promise<string | null> {
    // articleService
    let object: LeaveWord | ArticleCommentEntity;
    if (source === CommentConstants.SourceArticle) {
      object = await this.articleCommentRepository.findOneByOrFail({ id });
    } else if (source === CommentConstants.SourceMessage) {
      object = await this.leaveWordRepository.findOneByOrFail({ id });
    }
    return object?.userId;
  }

  async notifyComment(source: string, createCommentDto: CreateCommentDto, userId: string) {

    // 判断是一级回复，还是二级回复
    // 一级评论直接给资源用户发布
    // 二级评论给上级评论的用户
    let receive: string;
    let sourceId: string;
    if (createCommentDto.rootId) {
      // 获取接受用户id
      const sId = createCommentDto.parentId;
      receive = await this.getUserIdBySourceId(source, sId);
      sourceId = sId;
    } else {
      sourceId = createCommentDto.sourceId;
      // 判断是文章还是留言
      if (!sourceId) {
        receive = null;
      } else {
        const article = await this.articleService.findById(String(sourceId));
        if (article) {
          receive = article.userId;
        }
      }
    }

    // 通知
    let NType: NotifyObjectType;

    if (source == CommentConstants.SourceArticle) {
      if (!createCommentDto.rootId) {
        NType = NotifyObjectType.article;
      } else {
        NType = NotifyObjectType.comment;
      }
    } else if (source == CommentConstants.SourceMessage) {
      NType = NotifyObjectType.message;
    }
    if (receive && NType) {
      await this.notifyService.publish(NType, NotifyActionType.comment, sourceId, userId, receive, createCommentDto.content);
    }
  }

  async changeStatus(source: string, id: string, status: ContentStatus = ContentStatus.Verifying) {
    const commentRepository = this.getCommentSchema(source);
    const comment = await commentRepository.findOneByOrFail({ id });
    comment.status = status;
    commentRepository.save(comment);
    this.notifyService.publish(NotifyObjectType.article, NotifyActionType.audit, comment.id, systemObjectId, comment.userId, ContentStatusLabelMap[status])
    return comment;
  }

  async getListByUserId(source: string, id: string) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository.find({
      where: { userId: id },
      relations: ['object', 'parent', 'root', 'user', 'root.user', 'object.user', 'parent.user']
    });
  }

  async findList(source: string, listDto: AllListDto) {
    const commentRepository = this.getCommentSchema(source);

    let query = {};

    listDto.page_index = Number(listDto.page_index) || 1;
    listDto.page_size = Number(listDto.page_size) || 20;

    if (listDto.keyword) {
      const keyRe = listDto.keyword;
      query = [
        { content: Like(`%${keyRe}%`) },
        {
          user: {
            username: Like(`%${keyRe}%`)
          }
        },
      ];
    }
    const list = await commentRepository
      .find({
        where: query,
        skip: (listDto.page_index - 1) * listDto.page_size,
        take: listDto.page_size,
        order: {
          updateAt: 'desc',
        },
        relations: ['parent', 'root', 'user', 'root.user', 'parent.user'].concat(source === CommentConstants.SourceArticle ? ['object', 'object.user'] : [])
      })
    const total = await commentRepository.count({
      where: query
    });
    return {
      list,
      total
    }
  }

  async getById(source: string, id: string) {
    const commentRepository = this.getCommentSchema(source);

    return commentRepository.findOneOrFail({
      where: { id },
      relations: ['article', 'parent', 'root', 'user', 'root.user', 'article.user', 'parent.user']
    });
  }

  async delById(source: string, id: string) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository.delete(id)
  }

  async updateById(source: string, id: string, content: string) {
    const commentRepository = this.getCommentSchema(source);
    const htmlContent = MarkDownUtils.markdown(content);

    const comment = await commentRepository.findOneByOrFail({ id });
    comment.content = htmlContent;
    return commentRepository.save(comment);
  }

  // 查询子评论
  async getChildCommentList(source: string, rootId: string) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository
      .find({
        where: {
          rootId, status: ContentStatus.VerifySuccess
        },
        relations: ['parent', 'parent.user', 'user', 'likes']
      });
  }

  /**
   * 查询一级评论,分页
   */
  async getRootCommentList(source: string, sourceId?: string, lastCommentID?: string, limit: number = 10) {
    const commentRepository = this.getCommentSchema(source);
    const query: any = {
      rootId: IsNull(),
      status: ContentStatus.VerifySuccess
    };
    if (lastCommentID) {
      const lastComment = await commentRepository.findOneBy({ id: lastCommentID });
      query.createAt = MoreThan(lastComment.createAt);
    }
    if (sourceId && sourceId !== CommentConstants.CommonMessageID && source === CommentConstants.SourceArticle) {
      query.objectId = sourceId;
    }
    const list = await commentRepository
      .find({
        where: query,
        order: {
          createAt: 'DESC'
        },
        take: limit,
        relations: ['user', 'likes']
      });

    const counts_p = list.map(item => {
      return commentRepository.countBy({
        status: ContentStatus.VerifySuccess,
        rootId: item.id
      })
    });

    const counts = await Promise.all(counts_p);

    const comments = list.map((item, index) => {
      return {
        ...item,
        commentCounts: counts[index]
      };
    });

    return comments;
  }

  getRootNewList(source: string) {
    const commentRepository = this.getCommentSchema(source);
    const list = commentRepository
      .find({
        where: {
          status: ContentStatus.VerifySuccess
        },
        order: {
          createAt: 'DESC',
        },
        take: 6,
        relations: ['user']
      });
    return list;
  }

  /**
   * 是否是有效的评论源
   */
  isValidSource(source: string) {
    if ([CommentConstants.SourceArticle, CommentConstants.SourceMessage].indexOf(source) >= 0) {
      return true;
    }
    return false;
  }


  async hashLikeByUid(source: string, cid: string, uid: string) {
    const commentRepository = this.getCommentSchema(source);

    const sourceObj = await commentRepository.findOneOrFail({
      where: { id: cid },
      relations: ['likes']
    });

    if (sourceObj?.likes?.length) {
      return (sourceObj.likes as (ArticleCommentLike | LeaveWordLike)[]).find(item => {
        return uid === item.userId
      });
    }
    return false;
  }

  async likeById(source: string, cid: string, uid: string) {
    const commentRepository = this.getCommentSchema(source);
    const data = await commentRepository.findOneOrFail({
      where: { id: cid },
      relations: ['likes']
    });
    const like = this.getCommentLikeEntity(source);
    like.userId = uid;
    like.objectId = cid;

    data.likes = [...data.likes, like] as any[];
    await commentRepository.save(data);

    // 通知
    let nType: NotifyObjectType;

    if (source == CommentConstants.SourceArticle) {
      nType = NotifyObjectType.comment;
    } else if (source == CommentConstants.SourceMessage) {
      nType = NotifyObjectType.message;
    }
    if (nType) {
      await this.notifyService.publish(nType, NotifyActionType.like, cid, uid, data.userId);
    }
    // $push
    return like;
  }

  async unlikeById(source: string, cid: string, uid: string) {
    const commentRepository = this.getCommentLikeSchema(source);

    return commentRepository.delete({
      userId: uid,
      objectId: cid
    });
  }

  async allMarkdownContentToHtmlContent(source: string) {

    const commentSchema = this.getCommentSchema(source);
    const list = await commentSchema.find({});

    list.forEach(item => {
      this.updateById(source, item.id, item.content);
    });

  }

  async count() {
    const { SourceArticle, SourceMessage } = CommentConstants;
    const list = [SourceArticle, SourceMessage];
    const pList = list.map(item => this.getCommentSchema(item).count());
    const [article, message] = await Promise.all(pList);
    return {
      article,
      message
    }
  }

  async growthData(type: DateType = DateType.day, size: number = 30) {
    const { SourceArticle, SourceMessage } = CommentConstants;
    const _list = [SourceArticle, SourceMessage].map(item => {
      const schema = this.getCommentSchema(item);

      const date = moment();
      const list = [];
      for (let i = 0; i < size; i++) {

        const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');
        const endDate = moment(startDate).add(1, type).format('YYYY-MM-DD');

        const findPromise = schema.countBy({
          createAt: Between(new Date(startDate + (type === DateType.day ? '' : '-01') + ' 00:00:00'), new Date(endDate + ' 23:59:59'))
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
    });

    return Promise.all(_list);
  }

  async historyData(type: DateType = DateType.day, size: number = 30) {
    const { SourceArticle, SourceMessage } = CommentConstants;
    const _list = [SourceArticle, SourceMessage].map(item => {
      const schema = this.getCommentSchema(item);

      const date = moment();
      const list = [];
      for (let i = 0; i < size; i++) {

        const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');

        const findPromise = schema.countBy({
          createAt: LessThan(new Date(startDate + (type === DateType.day ? '' : '-30') + ' 23:59:59'))
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
    });

    return Promise.all(_list);
  }

}
