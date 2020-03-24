import Vue from 'vue'
import './api'
import App from './App.vue'
import router from './router'
import store from './store'

import * as $util from './common/utils'
import './common/filters'

import permissions from './permissions';

permissions(router, store);

import 'normalize.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './common.scss';

Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.$util = Vue.prototype.$util = $util;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
