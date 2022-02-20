/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-07 10:40:14
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-09 10:20:44
 * @Description: 
 */

import axios from 'axios'

const http = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? "http://localhost:9905" : "http://bucai-blog-server:9905/"
})

export default http;