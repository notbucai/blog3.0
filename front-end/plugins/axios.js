/*
 * @Author: bucai
 * @Date: 2020-04-19 14:39:55
 * @LastEditors: bucai
 * @LastEditTime: 2020-04-19 15:08:27
 * @Description: axios配置
 */

export default function ({ $axios, redirect }) {

  $axios.setBaseURL(process.env.BASE_URL);
  $axios.onResponse(res => {
    console.log('$axios',res);
  });
  $axios.onError(error => {
    if (error.response.status === 500) {
      // redirect('/sorry')
    }
  })
}