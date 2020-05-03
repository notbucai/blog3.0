<!--
 * @Author: bucai
 * @Date: 2020-05-03 12:11:12
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-03 12:51:47
 * @Description: 
 -->
<template>
  <v-snackbar v-model="open" :color="color" :timeout="timeout" top>{{ message }}</v-snackbar>
</template>
 
<script>
export default {
  name: 'Snackbar',
  data() {
    return {
      icon: '',
      color: '',
      open: false,
      message: '',
      timeout: 1500
    };
  },
  created() {},
  methods: {
  }
};
</script>
 
<style lang='scss'>

</style>