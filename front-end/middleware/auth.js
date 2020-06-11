/*
 * @Author: bucai
 * @Date: 2020-06-03 14:46:26
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-03 15:06:40
 * @Description: 
 */
export default function ({ store, error, redirect }) {
  if (!store.state.user) {
    redirect('/');
  }
}
