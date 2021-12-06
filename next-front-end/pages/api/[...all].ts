/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-28 16:06:46
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-06 12:24:44
 * @Description: 
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import { DATA_BASE_API } from '../../config/website.config'

type Data = {
  name: string
}

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: DATA_BASE_API,
    // timeout: 6000,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
    pathRewrite: [{
      patternStr: '^/api',
      replaceStr: ''
    }],
  })
}
