/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-07 10:40:14
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-07 10:40:14
 * @Description: 
 */

const axios = require('axios').default

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "http://localhost:9905" : "http://bucai-blog-server:9905/";

module.exports = axios;