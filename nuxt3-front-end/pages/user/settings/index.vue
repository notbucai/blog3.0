<!--
 * @Author: bucai
 * @Date: 2020-06-02 09:05:44
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-02 09:16:01
 * @Description: 
--> 
<template>
  <div></div>
</template>
<script>
export default {
  middleware: 'auth',
  created () {
    this.$router.replace('/user/settings/profile');
  }
}
</script>