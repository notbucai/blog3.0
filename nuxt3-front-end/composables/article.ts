/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-09 15:24:06
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-10 18:46:16
 * @Description: 
 */
export interface PaginationParam {
  page_index: number;
  page_size?: number;
}

export const useArticle = (params: PaginationParam) => {
  const fetch = useFetch<string, { code: number, data: any }>('/api/cache/home', { params })
  const cacheList = [];

  return fetch
}