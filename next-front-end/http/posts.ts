/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-29 10:06:09
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-06 13:34:17
 * @Description: 
 */
import { useRequest } from "ahooks"
import { BasicPost } from "../model/post"
import { requestList, RequestParams } from "../plugins/axios"

export const getPosts = (params?: RequestParams) => {
  return requestList<BasicPost>({
    url: "/article/list/all",
    method: "get",
    params
  })
}

export const usePosts = () => {
  return useRequest(async (params?: RequestParams) => {
    return getPosts(params)
  }, {
    manual: true
  })
}

export const getHotPosts = () => {
  return requestList<BasicPost>({
    url: "/article/list/hot",
    method: "get"
  })
}

export const useHotPosts = () => {
  return useRequest(async () => {
    return getHotPosts()
  })
}