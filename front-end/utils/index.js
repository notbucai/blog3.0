/*
 * @Author: bucai
 * @Date: 2020-05-07 13:05:39
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-07 13:14:53
 * @Description: 
 */

const md = require('markdown-it')()
  .use(require('markdown-it-highlightjs'));
export const markdown = (content) => {
  const resRender = md.render(content || '');
  return resRender;
}