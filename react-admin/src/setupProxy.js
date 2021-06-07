/*
 * @Author: bucai
 * @Date: 2021-02-25 14:34:39
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-14 22:39:38
 * @Description: 
 * https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'https://www.notbucai.com',
      target: 'http://0.0.0.0:9905/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
}