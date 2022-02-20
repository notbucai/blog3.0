/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-07 10:38:56
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-09 10:22:08
 * @Description: 
 */
import schedule from 'node-schedule';
import http from './http'

class Cache {
  private urls: string[];
  private job: schedule.Job;
  private cachePool: any = {};
  constructor(urls: string[]) {
    this.initTask(urls)
  }
  private initTask (urls: string[]) {

    const job = schedule.scheduleJob('30 * * * * *', async () => {
      // refresh
      urls.map(url => {
        return this.refresh(url)
      });
    });
    this.job = job;
  }
  async getCache (url: string) {
    let cache = this.cachePool[url];
    if (!cache) {
      return this.refresh(url)
    }
    return this.cachePool[url]
  }
  async refresh (url: string) {
    const res = await http.get(url)
    this.cachePool[url] = res.data ? res.data.data : null
    return this.cachePool[url];
  }
}

export const createCache = (urls: string[]) => {
  return new Cache(urls);
}
export const defaultCache = createCache([
  '/comment/list/new/article',
  '/article/list/hot',
  '/tag/list/effect',
  '/article/list/random'
]);