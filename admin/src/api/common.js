/*
 * @Author: bucai
 * @Date: 2020-03-23 09:31:46
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-08 17:35:20
 * @Description: 共用接口
 */

import { $ajax, $post, $get, $put, $del } from '../plugins/axios';

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

export const changeArticleUpStatus = (id, data) => {
  return $put(`/article/${id}/upstatus`, data);
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



export const aclList = (params) => {
  return $get(`/role/acl`, { params });
}
export const aclCreate = (data) => {
  return $post(`/role/acl`, data);
}
export const aclDelete = (id) => {
  return $del(`/role/acl/${id}`);
}
export const aclUpdate = (id, data) => {
  return $put(`/role/acl/${id}`, data);
}


export const roleList = (params) => {
  return $get(`/role`, { params });
}
export const roleDelete = (id) => {
  return $del(`/role/${id}`);
}
export const roleCreate = (data) => {
  return $post(`/role`, data);
}
export const roleUpdate = (id, data) => {
  return $put(`/role/${id}`, data);
}
export const roleBind = (id, data) => {
  return $post(`/role/bind/${id}`, data);
}
export const roleAcl = (params) => {
  return $get(`/role/acl/role`, { params });
}


export const linksList = (params) => {
  return $get(`/links/list`, { params });
}
export const linkCreate = (data) => {
  return $post(`/links`, data);
}
export const linkDelete = (id) => {
  return $del(`/links/${id}`);
}
export const linkUpdate = (id, data) => {
  return $put(`/links/${id}`, data);
}


export const uploadImage = (data) => {
  return $post('/common/uploadImage', data);
}

export const keywordsList = (params) => {
  return $get(`/keywords/list`, { params });
}

export const keywordsDeleteItem = (id) => {
  return $del(`/keywords/${id}`);
}

export const keywordGenerate = () => {
  return $post(`/keywords/generate`);
}

export const keywordsChangeItemStatus = (id, status) => {
  return $put(`/keywords/${id}/status`, {}, {
    params: {
      status
    }
  });
}
