/*
 * @Author: bucai
 * @Date: 2020-04-19 14:39:55
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-12 17:47:01
 * @Description: axios配置
 */
import Snackbar from '../components/snackbar';

export default function ({ $axios, app, redirect, error: _error, ...other }) {
  // console.log(process.env.API_BASE_URL);
  // console.log('$cookies', app.$cookies);
  const errorHandle = (error) => {
    const message = error.message;
    console.log('errorHandle=> error', error.code);
    if ([403, 1001, 1002, 1003, 1004].includes(error.code)) {
      app.$cookies.remove('Authorization');
      redirect(other.route.path === '/auth' ? '/' : '/auth');
    }
    if (process.client) {
      Snackbar.error(message);
    }
  }

  // $axios.setBaseURL(process.env.API_BASE_URL);
  $axios.onRequest(config => {
    const token = app.$cookies.get('Authorization');
    // console.log('token', token);
    if (token) {
      config.headers['Authorization'] = token;
    }
  });
  $axios.onResponse(res => {
    // console.log('$axios', res.data);
    const resData = res.data;
    if (typeof resData === 'object') {
      if (resData.code === 0) {
        return resData.data;
      }
      errorHandle(resData);
      if (process.client) {
        throw resData;
      }
    }
    return res;
  });


  // 处理服务器错误
  $axios.onError(error => {
    // console.log('HTTP_ERROR', error);
    try {
      console.log('error.message', error, JSON.stringify(error.message));
    } catch (error2) {
      console.log('console log error', error, error2);
    }
  })
}