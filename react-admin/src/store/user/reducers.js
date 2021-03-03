/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:54
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 14:16:54
 * @Description:
 */
import { cloneDeep } from 'loadsh'
import defaultState from "./state";
import { UPDATE_USER } from "./types";
/**
 *
 * @param {defaultState} state
 * @param {{type:string,payload?:any}} action
 */
const reducers = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_USER + '_FULFILLED': {
      const newState = cloneDeep(state)
      newState.userInfo = payload;
      return newState;
    }
    default:
      break;
  }

  return state;
}
export default reducers;