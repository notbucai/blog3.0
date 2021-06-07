import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Exclude } from 'class-transformer';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Role } from './role.entity';

class UserScoreDef {
    readonly CreateArticle: number = 5;
}

export const UserScore = new UserScoreDef();

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

export class User extends Base {

    @prop({ default: Date.now() })
    createdAt: Date;

    @prop({ default: Date.now() })
    updatedAt: Date;

    @prop({ default: null })
    deletedAt: Date;

    @prop({ default: null })
    loginAt: Date;

    @prop()
    activatedAt: Date; // 账号激活时间

    @prop({ index: true })
    username: string;

    @prop({ index: true })
    email: string;

    @prop({ index: true })
    phone: string;

    @Exclude()
    @prop()
    pass: string;

    @prop()
    value: number; // 值

    @prop()
    articleCount: number;

    @prop()
    articleViewCount: number; // 文章被阅读的次数

    @prop()
    commentCount: number;

    @prop({ ref: Role, default: null })
    role: Ref<Role>; // 角色

    @prop()
    isAdmin: boolean; // 是否管理员

    @prop()
    status: UserStatus; // 用户状态

    @prop()
    avatarURL: string; // 头像

    @prop()
    sex: UserSex;

    @prop()
    job: string;

    @prop()
    company: string;

    @prop()
    numberroduce: string; // 个人介绍

    @prop()
    personalHomePage: string; // 个人主页

    @prop()
    location: string;

    @prop({ index: true })
    githubID: string;

    @prop()
    githubAvatarURL: string;

    @prop()
    githubLogin: string;

    @prop()
    githubName: string;

    @prop({ index: true })
    weiboID: string;

    @prop()
    weiboScreenName: string;

    @prop()
    weiboAvatarURL: string;

    @prop()
    weiboName: string;

    @prop()
    weiboAvatarLarge: string;

    @prop({ index: true })
    qqID: string;

    @prop()
    qqName: string;

    @prop()
    qqAvatar: string;

    @prop({ index: true })
    baiduID: string;

    @prop()
    bucaiScreenName: string;

    @prop()
    baiduName: string;

    @prop()
    baiduAvatarLarge: string;

    @prop({ index: true })
    giteeID: string;

    @prop()
    giteeLogin: string;

    @prop()
    giteeName: string;

    @prop()
    giteeAvatar: string;

    @prop()
    giteeEmail: string;

    @prop()
    giteeUrl: string;

    @prop({ index: true })
    notbucaiID: string;

    @prop()
    notbucaiOpenid: string;

    @prop()
    notbucaiNickname: string;
    @prop()
    notbucaiAvatarUrl: string;

}