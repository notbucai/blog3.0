/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:54
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 15:04:35
 * @Description:
 */
import { cloneDeep } from 'lodash'
import defaultState from "./state";
import { SET_TOKEN } from "./types";
/**
 *
 * @param {defaultState} state
 * @param {{type:string,payload?:any}} action
 */
const reducers = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TOKEN + '_FULFILLED': {
      const newState = cloneDeep(state)
      newState.token = payload;
      return newState;
    }
    default:
      break;
  }

  return state;
}
export default reducers;