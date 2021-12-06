"use strict";

import axios, { AxiosRequestConfig } from "axios";

let config = {
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'http://localhost/api',
  timeout: 10 * 1000, // Timeout
};

const _axios = axios.create(config);

export interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}
export interface RequestParams {
  page_index: number
}

export type ResponseDataList<T> = { list: T[], total: number }
export async function request<T, D = any> (options: AxiosRequestConfig<D>) {
  const response = await _axios.request<ResponseData<T>>(options);
  const resData = response.data;
  if (resData.code === 0) {
    return resData.data;
  } else {
    if (resData.code === 403 || resData.code > 1000 && resData.code <= 1010) {
      return Promise.reject(resData);
    }
  }
  return Promise.reject(resData);
}

export async function requestList<T, D = any> (options: AxiosRequestConfig<D>) {
  return request<ResponseDataList<T>, D>(options)
}

export default _axios;
