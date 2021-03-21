/*
 * @Author: bucai
 * @Date: 2021-02-25 16:01:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-05 19:51:34
 * @Description:
 */
import { useRequest as aUseRequest } from 'ahooks';
import { merge } from 'lodash'
import axios from './request';

const useRequest = (options, config = {}) => {
  return aUseRequest(options, merge(config, {
    requestMethod: param => axios(param),
  }));
}
export default useRequest;
