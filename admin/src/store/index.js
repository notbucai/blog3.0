import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store2';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: store.get('token', null),
    user: store.get('user', null),
  },
  mutations: {
    SET_TOKNE(state, data) {
      state.token = data;
    },
    SET_USER(state, data) {
      state.user = data;
    }
  },
  actions: {
    setToken({ commit }, payload) {
      commit('SET_TOKNE', payload);
      store.set('token', payload);
    },
    setUser({ commit }, payload) {
      commit('SET_USER', payload);
      store.set('user', payload);
    }
  },
  modules: {
  }
})
