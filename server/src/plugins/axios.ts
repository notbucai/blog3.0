/*
 * @Author: bucai
 * @Date: 2021-06-07 12:53:55
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-07 13:05:58
 * @Description: 
 */
import axios from 'axios';
import * as pino from 'pino';

const logger = pino({
  prettyPrint: true
});

const http = axios.create({
  timeout: 5000
});

http.interceptors.request.use((config) => {
  logger.info(`(AXIOS) -> [${new Date().toISOString()}] URL: ${config.url} QUERY: ${JSON.stringify(config.params)}`)
  return config;
});

export default http