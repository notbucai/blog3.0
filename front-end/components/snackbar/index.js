/*
 * @Author: bucai
 * @Date: 2020-05-03 12:23:16
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-03 12:47:38
 * @Description: 
 */

import Vue from 'vue';
import SnackbarComponent from './Snackbar.vue';
let SnackbarConstructor = Vue.extend(SnackbarComponent);

const Snackbar = {};

['success', 'warning', 'info', 'error'].forEach(type => {
  Snackbar[type] = message => {
    const instance = new SnackbarConstructor({
      data: {
        open: true,
        message: message,
        color: type
      }
    });
    instance.$mount();
    document.body.appendChild(instance.$el);
    return instance;
  };
});

export default Snackbar;