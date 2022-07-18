<!--
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-03-12 17:47:15
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-12 18:11:09
 * @Description: 
-->
<template>
  <div class="auth-page text-center pt-8 body-2" v-if="!token || !user || !user.id">登录失效，请点击右上角进行登录</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data () {
    return {

    };
  },
  computed: {
    ...mapState(['user', 'token'])

  },
  created () {
    if (!this.$isServer) {
      this.$router.replace('/')
      if(!this.token || !this.user || !this.user.id){
        this.SET_LOGIN_OR_REGISTER_DIALOG();
      }
    }
  },
  mounted () {

  },
  methods: {
    ...mapMutations(['SET_LOGIN_OR_REGISTER_DIALOG']),
  }
}
</script>
<style lang="scss" scoped>
.auth-page {
  text-align: center;
}
</style>