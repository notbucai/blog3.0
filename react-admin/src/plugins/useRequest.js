/*
 * @Author: bucai
 * @Date: 2021-02-25 16:01:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-25 16:01:50
 * @Description: 
 */

import { makeUseAxios } from 'axios-hooks'
import LRU from 'lru-cache'
import axios from './request';

const cache = new LRU({ max: 10 })

const useRequest = makeUseAxios({ axios, cache });

export default useRequest;
