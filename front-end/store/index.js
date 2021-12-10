/*
 * @Author: bucai
 * @Date: 2020-05-02 21:09:11
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-08 18:07:45
 * @Description: 
 */

export const state = () => ({
  LoginOrRegisterDialog: false,
  token: '',
  user: null,
  sideStatus: false,
  noticeStatus: {
    unread: 0
  },
  website: {
    startTime: new Date(),
    buildTime: new Date('2020-06-02'),
    viewCount: 999999999,
  }
});
export const mutations = {
  SET_SIDE_STATUS (state, val) {
    state.sideStatus = val;
  },
  SET_LOGIN_OR_REGISTER_DIALOG (state) {
    state.LoginOrRegisterDialog = !state.LoginOrRegisterDialog;
  },
  SET_TOKEN (state, payload) {
    state.token = payload;
  },
  SET_USER (state, payload) {
    state.user = payload;
  },
  SET_NOTICE_STATUS (state, payload) {
    state.noticeStatus = payload;
  },
}
export const actions = {
  hasLike ({ commit, state }, likes) {
    const uId = state.user._id;
    return Array.isArray(likes) ? likes.find(item => item == uId) : false;
  },
  // nuxtServerInit，用以初始化数据
  async nuxtServerInit ({ commit }, { app, $axios }) {
    // 从cookie中获取token，并且将其中的数据更新到store
    const token = app.$cookies.get('Authorization')
    // 如果存在token
    if (token) {
      // 获取用户信息更新
      // commit用以提交需要更新的数据，并指定更新的方法
      const userinfo = await $axios.get('api/users/info');
      // userinfo
      commit('SET_TOKEN', token);
      commit('SET_USER', userinfo);
    }
  },
  async updateUserInfo ({ commit, state }, { key, value }) {
    const user = Object.assign({}, state.user);
    user[key] = value;
    commit('SET_USER', user);
  },
  async loadNoticeStatus ({ commit, state }) {
    if (!state.user) return;
    const resData = await this.$axios.get('/api/users/notify/count');
    commit('SET_NOTICE_STATUS', resData);
  }
}