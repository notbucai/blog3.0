/*
 * @Author: bucai
 * @Date: 2020-04-19 14:39:55
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-03 15:33:15
 * @Description: axios配置
 */
import Snackbar from '../components/snackbar';

export default function ({ $axios, $cookies, app, redirect, error: _error }) {
  // console.log(process.env.API_BASE_URL);
  // console.log('$cookies', app.$cookies);

  const errorHandle = (error) => {
    const message = error.message;
    if (process.client) {
      Snackbar.error(message);
    }
    if ([403, 1001, 1002, 1003, 1004].includes(error.code)) {
      return redirect('/');
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
    if (resData.code === 0) {
      return resData.data;
    }
    errorHandle(resData);
    throw resData;
  });


  // 处理服务器错误
  $axios.onError(error => {
    console.log('HTTP_ERROR', error);
    console.log('error.message', JSON.stringify(error.message));
  })
}