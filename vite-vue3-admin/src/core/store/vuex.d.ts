/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-10-24 20:29:17
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-10-24 20:29:17
 * @Description:
 */
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // 声明自己的 store state
  interface State {
    count: number
  }

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}