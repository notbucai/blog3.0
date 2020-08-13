<!--
 * @Author: bucai
 * @Date: 2020-06-02 17:13:09
 * @LastEditors: bucai
 * @LastEditTime: 2020-08-13 11:28:39
 * @Description: 
--> 
<template>
  <div class="bind">
    <p>{{message}}</p>
  </div>
</template>
<script>
export default {
  async asyncData ({ route, app, $axios, store }) {

    const res = {
      message: "失败",
      status: false,
    };
    const { code, state } = route.query;
    try {
      // 发送ajax
      const resData = await $axios.get('/api/oauth/login', {
        params: {
          code, state
        }
      });
      app.$cookies.set('Authorization', '' + resData, {
        maxAge: 1 * 60 * 60
      });
      store.commit('SET_TOKEN', resData);
      res.message = "成功";
      res.status = true;
    } catch (error) {
      res.message = error.message || error.errMsg || error.toString();
      res.status = false;
    }
    return res;
  },
  layout: 'empty',
  components: {},
  computed: {},
  data () {
    return {
      message: "",
      status: false,
      timeCount: 5000
    };
  },
  mounted () {
    if (this.status) {
      this.timeCount = 500;
    }
    setTimeout(() => {
      window.postMessage('close', "*");
      window.close();
    }, this.timeCount);
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.bind {
  text-align: center;
}
</style>