/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-09 10:04:03
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-09 10:24:17
 * @Description: 
 */
import type { IncomingMessage, ServerResponse } from 'http'
import { defaultCache } from '../../plugins/cache';
import http from '../../plugins/http'

export default async (req: IncomingMessage, res: ServerResponse) => {
  const httpUrls = [
    ['/article/list/hot', 'cache'],
    ['/article/list/all', ''],
    ['/tag/list/effect', 'cache'],
    ['/article/list/random', 'cache'],
    ['/comment/list/new/article', 'cache'],
  ];

  const promiseList = httpUrls.map(async (item) => {
    const [url, type] = item;
    if (type === 'cache') {
      return {
        data: {
          data: await defaultCache.getCache(url)
        }
      }
    }
    return http.get(url)
  });

  const data = await Promise.all(promiseList)
  const resultData = {
    code: 0,
    data: data.map(item => item.data ? item.data.data : {})
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.statusCode = 200
  res.end(Buffer.from(JSON.stringify(resultData)))
}