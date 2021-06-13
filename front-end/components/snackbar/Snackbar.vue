<!--
 * @Author: bucai
 * @Date: 2020-05-03 12:11:12
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-13 11:19:35
 * @Description: 
 -->
<template>
  <v-snackbar v-model="open" :color="color" :timeout="timeout" top>{{
    message
  }}</v-snackbar>
</template>
 
<script>
export default {
  name: 'Snackbar',
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