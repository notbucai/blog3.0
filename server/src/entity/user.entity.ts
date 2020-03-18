import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

class UserScoreDef {
    readonly CreateArticle: number = 5;
}

export const UserScore = new UserScoreDef();

export enum UserRole {
    Normal = 1, // 普通用户
    Editor = 2, // 网站编辑
    Admin = 3, // 管理员
    SuperAdmin = 4, // 超级管理员
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

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    _id: ObjectID;

    @Column('datetime', {})
    createdAt: Date;

    @Column('datetime', {})
    updatedAt: Date;

    @Column('datetime', { nullable: true, default: null })
    deletedAt: Date;

    @Column('datetime', { nullable: true, default: null })
    activatedAt: Date; // 账号激活时间

    @Column('string', { length: 100 })
    username: string;

    @Column('string', { length: 50 })
    email: string;

    @Column('string', { length: 50, nullable: true, default: null })
    phone: string;

    @Exclude()
    @Column('string', { length: 100 })
    pass: string;

    @Column('number', { default: 0 })
    value: number; // 米粒值

    @Column('number', { default: 0 })
    articleCount: number;

    @Column('number', { default: 0 })
    articleViewCount: number; // 文章被阅读的次数

    @Column('number', { default: 0 })
    commentCount: number;

    @Column('number', { default: 0 })
    wordCount: number; // 写了多少字

    @Column('number', { default: 0 })
    boilingPonumberCount: number; // 沸点数量

    @Column('number', { default: 0 })
    followCount: number; // 关注了多少人

    @Column('number', { default: 0 })
    followerCount: number; // 被多少人关注

    @Column('number', { default: 0 })
    followTagCount: number; // 关注了多少个标签

    @Column('number', { default: 0 })
    likedCount: number; // 获得多少个赞

    @Column('number', { default: 0 })
    uLikeCount: number; // 用户一共点了多少个赞

    @Column('number', { default: 0 })
    uArticleLikeCount: number; // 用户对文章点了多少个赞

    @Column('number', { default: 0 })
    uBoilingPonumberLikeCount: number; // 用户对沸点点了多少个赞

    @Column('number', { default: 0 })
    collectionCount: number; // 收藏集的个数

    @Column('number')
    role: UserRole; // 角色

    @Column('number')
    status: UserStatus; // 用户状态

    @Column('string', { length: 500 })
    avatarURL: string; // 头像

    @Column('tinynumber')
    sex: UserSex;

    @Column('string', { length: 100 })
    job: string;

    @Column('string', { length: 100 })
    company: string;

    @Column('string', { length: 200 })
    numberroduce: string; // 个人介绍

    @Column('string', { length: 100 })
    personalHomePage: string; // 个人主页

    @Column('number', { nullable: true, default: null })
    githubID: number;

    @Column('string', { length: 500, nullable: true, default: null })
    githubAvatarURL: string;

    @Column('string', { length: 100, nullable: true, default: null })
    githubLogin: string;

    @Column('string', { length: 100, nullable: true, default: null })
    githubName: string;

    @Column('number', { nullable: true, default: null })
    weiboID: number;

    @Column('string', { length: 100, nullable: true, default: null })
    weiboScreenName: string;

    @Column('string', { length: 100, nullable: true, default: null })
    weiboName: string;

    @Column('string', { length: 500, nullable: true, default: null })
    weiboAvatarLarge: string;

    @Column('string', { length: 200, nullable: true, default: null })
    location: string;
}