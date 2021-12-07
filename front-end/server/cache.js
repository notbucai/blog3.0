/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-07 10:38:56
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-07 12:07:13
 * @Description: 
 */
const schedule = require('node-schedule');
const http = require('./http')

const cachePool = {

};

const refresh = async (url) => {
  const res = await http.get(url)
  cachePool[url] = res.data ? res.data.data : null
  return cachePool[url];
}

module.exports.initTask = (urls) => {
  const job = schedule.scheduleJob('30 * * * * *', async function () {
    // refresh
    urls.map(url => {
      return refresh(url)
    });
  });
  return job;
}

module.exports.getCache = async (url) => {
  let cache = cachePool[url];
  if (!cache) {
    return refresh(url)
  }

  return cachePool[url]
}

