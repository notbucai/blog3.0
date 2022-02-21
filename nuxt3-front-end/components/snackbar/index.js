/*
 * @Author: bucai
 * @Date: 2020-05-03 12:23:16
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-02-20 14:25:18
 * @Description: 
 */

import Vue from 'vue';
import Vuetify from '@vuetify/nightly/lib'
import SnackbarComponent from './Snackbar.vue';
let SnackbarConstructor = Vue.extend(SnackbarComponent);


const Snackbar = {};

['success', 'warning', 'info', 'error'].forEach(type => {
  Snackbar[type] = message => {
    const vuetifyObj = new Vuetify()

    const instance = new SnackbarConstructor({
      data: {
        open: true,
        message: message,
        type: type
      },
    });
    instance.$vuetify = vuetifyObj.framework;
    instance.$mount();
    document.body.appendChild(instance.$el);
    return instance;
  };
});

export default Snackbar;