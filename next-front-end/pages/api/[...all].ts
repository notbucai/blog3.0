/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-28 16:06:46
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-29 10:36:27
 * @Description: 
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'

type Data = {
  name: string
}

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: 'http://localhost:9905/',
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
    pathRewrite: [{
      patternStr: '^/api',
      replaceStr: ''
    }],
  })
}
