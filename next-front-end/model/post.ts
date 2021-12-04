/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-29 16:19:54
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-29 18:25:15
 * @Description: 
 */
export interface BasicPost {
  _id: string;
  title: string;
  summary: string;  
  up: number;
  wordCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  status: number;
  coverURL?: string;
}