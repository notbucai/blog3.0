/*
 * @Author: bucai
 * @Date: 2020-07-01 15:48:05
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-07-17 22:58:39
 * @Description: 
 */
export default {
  methods: {
    hasLike (likes) {
      if (!Array.isArray(likes)) return false;
      const user = this.$store.state.user;
      if (!user) return false;
      const id = user.id;
      return !!likes.find(item => item.userId == id);
    },
    changeLike (likes = []) {
      const user = this.$store.state.user;
      likes = Object.assign([], likes);

      if (!user) {
        this.$store.commit('SET_LOGIN_OR_REGISTER_DIALOG');
        throw new Error('未登陆');
        return likes;
      }
      const id = user.id;
      const index = likes.findIndex(item => item.userId == id);

      if (index < 0) {
        likes.push({
          userId: id
        });
      } else {
        likes.splice(index, 1);
      }
      return likes;
    },
  },
}