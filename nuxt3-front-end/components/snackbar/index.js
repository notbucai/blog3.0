/*
 * @Author: bucai
 * @Date: 2020-05-03 12:23:16
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-13 11:19:56
 * @Description: 
 */

import Vue from 'vue';
import Vuetify from 'vuetify/lib'
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