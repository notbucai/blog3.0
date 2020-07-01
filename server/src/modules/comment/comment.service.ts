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


@Injectable()
export class CommentService {

  constructor(
    // @InjectRepository(MessageComment)
    // private readonly messageCommentRepository: Repository<MessageComment>,
    // @InjectRepository(ArticleComment)
    // private readonly articleCommentRepository: Repository<ArticleComment>,
    @InjectModel(ArticleComment) public readonly articleCommentSchema: ReturnModelType<typeof ArticleComment>,
    @InjectModel(MessageComment) public readonly messageCommentSchema: ReturnModelType<typeof MessageComment>,
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
  /**
   * 创建评论
   */
  async create (source: string, createCommentDto: CreateCommentDto, userID: ObjectID) {
    const commentRepository = this.getCommentSchema(source);
    // sourceID 文章的时候是文章id 
    // parentID 表示父级评论id
    // rootID 表示一级评论  不填为一级
    console.log(CommentConstants.CommonMessageID);

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
    comment.status = CommentStatus.VerifySuccess;
    comment.user = userID;
    comment.content = createCommentDto.content;

    return commentRepository.create(comment);
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
    return commentRepository.updateOne({ _id: id }, { $set: { content, updatedAt: Date.now() } });
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
      .find({})
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

    const article = await commentRepository.findById(aid);

    if (!article) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    if (article.likes) {
      return !!article.likes.find((item: any) => {
        return uid.equals(item);
      });
    }
    return false;
  }

  async likeById (source: string, aid: ObjectID, uid: ObjectID) {
    const commentRepository = this.getCommentSchema(source);

    // $push
    return commentRepository.updateOne({ _id: aid }, {
      $addToSet: {
        likes: uid
      }
    });
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
}
