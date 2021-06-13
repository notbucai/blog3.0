import { NotifyActionType } from "src/models/notify.entiy";

/*
 * @Author: bucai
 * @Date: 2021-06-12 16:08:44
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-12 17:15:27
 * @Description: 
 * XXX 关注了你  - 「这则属于资源发布提醒」   
 * XXX 喜欢了你的文章 《消息通知系统模型设计》  - 「这则属于资源发布提醒」    

 * 你的文章《消息通知系统模型设计》已被加入专题 《系统设计》 - 「这则属于系统提醒」  

 * 小明赞同了你的回答 XXXXXXXXX  -「这则属于资源发布提醒

 * 你喜欢的文章《消息通知系统模型设计》有新的评论  - 「这则属于资源订阅提醒」  

*/

export const publish = {
  [NotifyActionType.comment]: "%s 评论了你的 %s ",
  [NotifyActionType.like]: "%s 点赞了你的 %s",
  [NotifyActionType.follow]: "%s 关注了你",
}