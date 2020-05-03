/*
 * @Author: bucai
 * @Date: 2020-04-19 14:39:55
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-03 18:16:56
 * @Description: axios配置
 */
import Vue from 'vue';
export default function ({ $axios, $cookies, app, redirect }) {
  // console.log(process.env.API_BASE_URL);
  // console.log('$cookies', app.$cookies);

  // $axios.setBaseURL(process.env.API_BASE_URL);
  $axios.onRequest(config => {
    const token = app.$cookies.get('Authorization');
    console.log('token', token);
    if (token) {
      config.headers['Authorization'] = token;
    }
  });
  $axios.onResponse(res => {
    console.log('$axios', res.data);
    const resData = res.data;
    if (resData.code === 0) {
      return resData.data;
    }
    throw new Error(resData.message);
  });
  // 处理错误
  $axios.onError(error => {
    console.log('HTTP_ERROR', error);
    console.log('error.message', JSON.stringify(error.message));
  })
}