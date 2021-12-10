import { Injectable } from '@nestjs/common';
import { Repository, LessThan, In } from 'typeorm';
import { ObjectID } from 'mongodb';
import { MessageComment, ArticleComment, Comment, CommentStatus } from '../../models/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentConstants } from '../../constants/comment';
import { CreateCommentDto } from './dto/create.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Article } from '../../models/article.entity';
import { User } from '../../models/user.entity';
import { AllListDto } from './dto/allList.dto';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { NotifyActionType, NotifyObjectType } from '../../models/notify.entiy';
import { NotifyService } from '../../common/notify/notify.service';
import { ArticleService } from '../article/article.service';
import MarkDownUtils from '../../utils/markdown'
import { DateType } from '../../constants/constants';
import moment = require('moment');
import { CensorService } from 'src/common/censor.service';

@Injectable()
export class CommentService {

  constructor(
    // @InjectRepository(MessageComment)
    // private readonly messageCommentRepository: Repository<MessageComment>,
    // @InjectRepository(ArticleComment)
    // private readonly articleCommentRepository: Repository<ArticleComment>,
    @InjectModel(ArticleComment) public readonly articleCommentSchema: ReturnModelType<typeof ArticleComment>,
    @InjectModel(MessageComment) public readonly messageCommentSchema: ReturnModelType<typeof MessageComment>,
    private readonly notifyService: NotifyService,
    private readonly articleService: ArticleService,
    private readonly censorService: CensorService,
  ) { }

  private getCommentSchema (source: string): any {
    let commentRepository: ReturnModelType<typeof ArticleComment> |
      ReturnModelType<typeof MessageComment>;
    if (source === CommentConstants.SourceArticle) {
      commentRepository = this.articleCommentSchema;
    } else if (source === CommentConstants.SourceMessage) {
      commentRepository = this.messageCommentSchema;
    }
    return commentRepository;
  }
  async censor (source: string, id: string) {
    const schema = this.getCommentSchema(source)
    const object = await schema.findById(new ObjectID(id))

    const content = object.content;

    const data = await this.censorService.applyBasic(content)
    if (data.status) {
      return this.changeStatus(source, id, CommentStatus.VerifySuccess)
    }

    if (data.type === 2) {
      return this.changeStatus(source, id, CommentStatus.VerifyFail)
    }
  }
  /**
   * 创建评论
   */
  async create (source: string, createCommentDto: CreateCommentDto, userID: ObjectID) {
    const commentRepository = this.getCommentSchema(source);
    // sourceID 文章的时候是文章id 
    // parentID 表示父级评论id
    // rootID 表示一级评论  不填为一级

    const comment = new Comment();
    if (ObjectID.isValid(createCommentDto.rootID)) {
      comment.rootID = new ObjectID(createCommentDto.rootID);
    }
    if (ObjectID.isValid(createCommentDto.parentID)) {
      comment.parent = new ObjectID(createCommentDto.parentID);
    }
    if (ObjectID.isValid(createCommentDto.sourceID)) {
      comment.sourceID = new ObjectID(createCommentDto.sourceID);
    } else {
      comment.sourceID = new ObjectID(CommentConstants.CommonMessageID);
    }

    const htmlContent = MarkDownUtils.markdown(createCommentDto.content);

    comment.status = CommentStatus.VerifySuccess;
    comment.user = userID;
    comment.content = createCommentDto.content;
    comment.htmlContent = htmlContent;

    return commentRepository.create(comment);
  }
  async getUserIdBySourceId (source: CommentConstants, id: ObjectID): Promise<ObjectID | null> {
    // articleService
    let Source: any;
    if (source === CommentConstants.SourceArticle) {
      Source = await this.articleCommentSchema.findById(id);
    } else if (source === CommentConstants.SourceMessage) {
      Source = await this.messageCommentSchema.findById(id);
    }
    return Source.user;
  }

  async notifyComment (source: string, createCommentDto: CreateCommentDto, userID: ObjectID) {

    // 判断是一级回复，还是二级回复
    // 一级评论直接给资源用户发布
    // 二级评论给上级评论的用户
    let receive: ObjectID;
    let sourceId: ObjectID;
    if (createCommentDto.rootID) {
      // 获取接受用户id
      const sId = new ObjectID(createCommentDto.parentID);
      receive = await this.getUserIdBySourceId(source, sId);
      sourceId = sId;
    } else {
      sourceId = new ObjectID(createCommentDto.sourceID);
      // 判断是文章还是留言
      if (sourceId.equals(CommentConstants.CommonMessageID)) {
        receive = null;
      } else {
        const article = await this.articleService.findById(String(sourceId));
        if (article) {
          receive = article.user as ObjectID;
        }
      }
    }

    // 通知
    let NType: NotifyObjectType;

    if (source == CommentConstants.SourceArticle) {
      if (!createCommentDto.rootID) {
        NType = NotifyObjectType.article;
      } else {
        NType = NotifyObjectType.comment;
      }
    } else if (source == CommentConstants.SourceMessage) {
      NType = NotifyObjectType.message;
    }

    if (receive && NType) {
      await this.notifyService.publish(NType, NotifyActionType.comment, sourceId, userID, receive);
    }
  }

  async changeStatus (source: string, id: string, status: CommentStatus = 1) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository.findByIdAndUpdate(id, { $set: { status } });
  }

  async getListByUserId (source: string, id: ObjectID | string) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository.find({ user: id })

      .populate({
        path: 'article',
        select: '-htmlContent -__v -content -tags -summary',
      })
      .populate({
        path: 'parent',
        select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate({
        path: 'rootID',
        select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate([{ path: 'user', select: "username avatarURL" }]);
  }

  async findList (source: string, listDto: AllListDto) {
    const commentRepository = this.getCommentSchema(source);

    let query = {};

    listDto.page_index = Number(listDto.page_index) || 1;
    listDto.page_size = Number(listDto.page_size) || 20;

    if (listDto.keyword) {
      const keyRe = new RegExp(listDto.keyword);
      query = {
        $or: [
          { content: keyRe },
          { 'user.username': keyRe },
        ]
      };
    }
    const list = await commentRepository
      .find(query)
      .skip((listDto.page_index - 1) * listDto.page_size)
      .limit(listDto.page_size)
      .populate({
        path: 'parent',
        select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate({
        path: 'article',
        // select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate({
        path: 'rootID',
        select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate([{ path: 'user', select: "username avatarURL" }])
    const total = await commentRepository.countDocuments(query);
    return {
      list,
      total
    }
  }

  async getById (source: string, id: string) {
    const commentRepository = this.getCommentSchema(source);

    return commentRepository.findById(id).populate({
      path: 'parent',
      select: '-sourceID -__v -rootID',
      populate: {
        path: 'user',
        select: "username avatarURL"
      },
    })
      .populate({
        path: 'rootID',
        select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate([{ path: 'user', select: "username avatarURL" }])
  }

  async delById (source: string, id: string) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository.deleteOne({ _id: id })
  }

  async updateById (source: string, id: string, content: string) {
    const commentRepository = this.getCommentSchema(source);
    const htmlContent = MarkDownUtils.markdown(content);
    return commentRepository.updateOne({ _id: id }, { $set: { content, htmlContent, updatedAt: Date.now() } });
  }

  // 查询子评论
  async getChildCommentList (source: string, rootID: string) {
    const commentRepository = this.getCommentSchema(source);
    return commentRepository
      .find({ rootID, status: CommentStatus.VerifySuccess }, '-sourceID -__v -rootID')
      .populate({
        path: 'parent',
        select: '-sourceID -__v -rootID',
        populate: {
          path: 'user',
          select: "username avatarURL"
        },
      })
      .populate([{ path: 'user', select: "username avatarURL" }])
      .exec()
  }

  /**
   * 查询一级评论,分页
   */
  async getRootCommentList (source: string, sourceID: string = CommentConstants.CommonMessageID, lastCommentID?: string, limit: number = 10) {
    const commentRepository = this.getCommentSchema(source);
    const query: any = {
      sourceID: sourceID,
      rootID: null,
      status: CommentStatus.VerifySuccess
    };
    if (lastCommentID) {
      query._id = {
        '$lt': new ObjectID(lastCommentID)
      };
    }
    const list = await commentRepository
      .find(query, '-sourceID -__v')
      .sort({ _id: -1 })
      .limit(limit)
      .populate([{ path: 'user', select: "username avatarURL" }]).exec()

    const counts_p = list.map(item => {
      return commentRepository.countDocuments({
        status: CommentStatus.VerifySuccess,
        rootID: item._id
      }).exec()
    });

    const counts = await Promise.all(counts_p);

    const comments = list.map((item, index) => {
      item = item.toJSON()
      item.commentCounts = counts[index];
      return item;
    });

    return comments;
  }

  getRootNewList (source: string) {
    const commentRepository = this.getCommentSchema(source);
    const list = commentRepository
      .find({
        status: CommentStatus.VerifySuccess
      })
      .sort({ _id: -1 })
      .limit(6)
      .populate([{ path: 'user', select: "username avatarURL" }])
      .populate({
        path: 'article',
        select: '-htmlContent -__v -content -tags -summary',
      })
      .exec()
    return list;
  }

  /**
   * 是否是有效的评论源
   */
  isValidSource (source: string) {
    if ([CommentConstants.SourceArticle, CommentConstants.SourceMessage].indexOf(source) >= 0) {
      return true;
    }
    return false;
  }


  async hashLikeByUid (source: string, aid: ObjectID, uid: ObjectID) {
    const commentRepository = this.getCommentSchema(source);

    const sourceObj = await commentRepository.findById(aid);

    if (!sourceObj) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    if (sourceObj.likes) {
      return !!sourceObj.likes.find((item: any) => {
        return uid.equals(item);
      });
    }
    return false;
  }

  async likeById (source: string, cid: ObjectID, uid: ObjectID) {
    const commentRepository = this.getCommentSchema(source);
    const like = await commentRepository.updateOne({ _id: cid }, {
      $addToSet: {
        likes: uid
      }
    });
    const article: Comment = await commentRepository.findById(cid);

    // 通知
    let nType: NotifyObjectType;

    if (source == CommentConstants.SourceArticle) {
      nType = NotifyObjectType.comment;
    } else if (source == CommentConstants.SourceMessage) {
      nType = NotifyObjectType.message;
    }
    if (nType) {
      await this.notifyService.publish(nType, NotifyActionType.like, cid, uid, article.user as ObjectID);
    }
    // $push
    return like;
  }

  async unlikeById (source: string, aid: ObjectID, uid: ObjectID) {
    const commentRepository = this.getCommentSchema(source);

    // $push
    return commentRepository.findByIdAndUpdate(aid, {
      $pull: {
        likes: uid
      }
    });
  }

  async allMarkdownContentToHtmlContent (source: string) {

    const commentSchema = this.getCommentSchema(source);
    const list: any[] = await commentSchema.find({});

    list.forEach(item => {
      this.updateById(source, item._id, item.content);
    });

  }

  async count () {
    const { SourceArticle, SourceMessage } = CommentConstants;
    const list = [SourceArticle, SourceMessage];
    const pList = list.map(item => this.getCommentSchema(item).countDocuments());
    const [article, message] = await Promise.all(pList);
    return {
      article,
      message
    }
  }

  async growthData (type: DateType = DateType.day, size: number = 30) {
    const { SourceArticle, SourceMessage } = CommentConstants;
    const _list = [SourceArticle, SourceMessage].map(item => {
      const schema = this.getCommentSchema(item);

      const date = moment();
      const list = [];
      for (let i = 0; i < size; i++) {

        const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');
        const endDate = moment(startDate).add(1, type).format('YYYY-MM-DD');

        const findPromise = schema.countDocuments({
          createdAt: {
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
    });

    return Promise.all(_list);
  }

  async historyData (type: DateType = DateType.day, size: number = 30) {
    const { SourceArticle, SourceMessage } = CommentConstants;
    const _list = [SourceArticle, SourceMessage].map(item => {
      const schema = this.getCommentSchema(item);

      const date = moment();
      const list = [];
      for (let i = 0; i < size; i++) {

        const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');

        const findPromise = schema.countDocuments({
          createdAt: {
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
    });

    return Promise.all(_list);
  }

}
