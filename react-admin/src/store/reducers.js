/*
 * @Author: bucai
 * @Date: 2021-02-25 14:03:56
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 15:06:21
 * @Description: 
 */

import { combineReducers } from "redux";
import app from './app';
import user from './user';
import system from './system';

const reducers = combineReducers({
  app,
  user,
  system,
});

export default reducers;