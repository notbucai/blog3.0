/*
 * @Author: bucai
 * @Date: 2020-07-01 15:48:05
 * @LastEditors: bucai
 * @LastEditTime: 2020-07-01 16:02:45
 * @Description: 
 */
export default {
  methods: {
    hasLike (likes) {
      if (!Array.isArray(likes)) return false;
      const user = this.$store.state.user;
      if (!user) false;
      const id = user._id;
      return !!likes.find(item => item == id);
    },
    changeLike (likes = []) {
      const user = this.$store.state.user;
      if (!user) {
        this.$store.commit('SET_LOGIN_OR_REGISTER_DIALOG');
        return [];
      }
      likes = Object.assign([], likes);
      const id = user._id;
      const index = likes.findIndex(item => item == id);
      console.log('index',index);
      
      if (index < 0) {
        likes.push(id);
      } else {
        likes.splice(index, 1);
      }
      return likes;
    },
  },
}