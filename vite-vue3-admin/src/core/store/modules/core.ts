/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-10-24 20:33:08
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-10-25 20:54:23
 * @Description:
 */
import { Module } from "vuex";
import { RootStateType } from "..";

export interface PermissionType {
  name: string
  title: string
  parent: string
}

export interface UserType {

}

export interface CodeStateType {
  permissions: PermissionType[],
  user: UserType
}

const module: Module<CodeStateType, RootStateType> = {
  namespaced: true,
  state: () => ({
    user: {

    },
    permissions: [],
  }),
  mutations: {

  },
  actions: {

  }
}

export default module