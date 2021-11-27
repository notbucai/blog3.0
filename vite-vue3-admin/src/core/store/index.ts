/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-10-24 20:27:11
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-10-24 21:04:11
 * @Description:
 */
import { createStore } from 'vuex'
import modules from './modules'

// 为 store state 声明类型
export interface RootStateType {
  count: number
}

// 创建一个新的 store 实例
export const store = createStore<RootStateType>({
  modules,
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
