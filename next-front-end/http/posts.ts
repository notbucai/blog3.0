/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-29 10:06:09
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-29 17:54:48
 * @Description: 
 */
import { useRequest } from "ahooks"
import { BasicPost } from "../model/Post"
import { requestList } from "../plugins/axios"

export const getPosts = () => {
  return requestList<BasicPost>({
    url: "/article/list/all",
    method: "get"
  })
}

export const usePosts = () => {
  return useRequest(async () => {
    return getPosts()
  })
}