/*
 * @Author: bucai
 * @Date: 2021-02-25 14:55:19
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-05 20:49:51
 * @Description:
 */

import axios from "axios";
import store from 'store2';
import { message } from 'antd'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/api',
  timeout: 12 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const token = store.get('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    const resData = response.data;
    if (resData.code === 0) {
      return resData.data;
    } else {
      if (resData.code === 403 || (resData.code > 1000 && resData.code <= 1010)) {
        const { pathname, search } = window.location
        // TODO: todo ing
        store.remove('token');
        window.location.replace('/login?redirect=' + encodeURIComponent(pathname + (search || '')))
        // router.replace({ path: '/login', query: { redirect: router.currentRoute.path } })
      }
      resData.message && message.error(resData.message)
      // resData.message && Message.error(resData.message);
    }
    return Promise.reject(resData);
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default _axios;