/*
 * @Author: bucai
 * @Date: 2020-03-23 09:31:46
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-24 21:00:48
 * @Description: 共用接口
 */

import { $ajax, $post, $get, $put,$del } from '../plugins/axios';

export const login = (data) => {
  return $post('/users/signin', data)
}

export const userInfo = () => {
  return $get('/users/info');
}

export const userlist = (params) => {
  return $get('/users/list', { params });
}

export const changeRole = (data) => {
  return $post('/users/change/role', data);
}

export const changeUserStatus = (id, data) => {
  return $put(`/users/${id}/status`, data);
}

export const articleList = (params) => {
  return $get('/article/list', { params });
}

export const changeArticleStatus = (id, data) => {
  return $put(`/article/${id}/status`, data);
}

export const commentList = (source, params) => {
  return $get(`/comment/alllist/${source}`, { params });
}

export const changeCommentStatus = (source, id, data) => {
  return $put(`/comment/${source}/${id}/status`, data);
}

export const tagList = (params) => {
  return $get('/tag/list', { params });
}

export const tagEdit = (id, data) => {
  return $put(`/tag/${id}`, data);
}

export const tagDelete = (id) => {
  return $del(`/tag/${id}`);
}

export const tagCreate = (data) => {
  return $post(`/tag`, data);
}