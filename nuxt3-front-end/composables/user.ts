/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-08 17:21:08
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-08 18:09:41
 * @Description: 
 */
import { useState } from "#app";

export enum UserSex {
  Male = 0, // 男
  Female = 1, // 女
  Unknown = 2, // 未知
}

export interface User {
  _id: string;
  avatarURL: string; // 头像
  username: string;
  createdAt: number;
  sex: UserSex;
  job: string;
  company: string;
  numberroduce: string; // 个人介绍
  personalHomePage: string; // 个人主页
  location: string;
}

export const useUser = () => useState<User | null>('user-user', () => null)
export const useNoticeStatus = () => useState('user-noticeStatus', () => ({
  unread: 0
}))