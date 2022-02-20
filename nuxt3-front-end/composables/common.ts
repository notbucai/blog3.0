/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-09 09:01:54
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-09 09:07:22
 * @Description: 
 */
import { useLoginOrRegisterDialog } from "./core";

export const useHasLike = () => {
  const userState = useUser()
  return (likes: string[]) => {
    const user = userState.value;
    if (!Array.isArray(likes)) return false;
    if (!user) return false;
    const id = user._id;
    return !!likes.find(item => item == id);
  }
}

export const useChangeLike = () => {
  const userState = useUser()
  const loginOrRegisterDialog = useLoginOrRegisterDialog()
  return (likes: string[] = []) => {
    const user = userState.value;
    likes = Object.assign([], likes);

    if (!user) {
      loginOrRegisterDialog.value = !loginOrRegisterDialog.value;
      throw new Error('未登陆');
    }
    const id = user._id;
    const index = likes.findIndex(item => item == id);
    console.log('index', index);

    if (index < 0) {
      likes.push(id);
    } else {
      likes.splice(index, 1);
    }
    return likes;
  }
}