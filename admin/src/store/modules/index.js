/*
 * @Author: bucai
 * @Date: 2021-06-08 09:24:55
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-08 11:43:07
 * @Description: 
 */
const ctx = require.context('./', true, /index\.js$/);

const modules = {};

ctx.keys().forEach(path => {
  if (path === './index.js') {
    return;
  }
  const moduleName = path.split('/')[1];
  const module = ctx(path);
  modules[moduleName] = module.default;
});

export default modules;
