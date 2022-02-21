<!--
 * @Author: bucai
 * @Date: 2020-05-03 12:11:12
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-02-20 18:00:36
 * @Description: 
 -->
<template>
  <v-snackbar v-model="open" :color="color" :timeout="timeout" top>{{
    message
  }}</v-snackbar>
</template>
 
<script>
export default {
  name: 'SnackbarComponent',
  data () {
    return {
      icon: '',
      type: '',
      open: false,
      message: '',
      timeout: 1500
    };
  },
  computed: {
    color () {
      const c = {
        'success': '#67c23a',
        'warning': '#e6a23c',
        'info': '#909399',
        'error': '#f56c6c'
      };
      return c[this.type]
    }
  },
  created () { },
  methods: {
  }
};
</script>
 
<style lang='scss'>
</style>