<!--
 * @Author: bucai
 * @Date: 2020-06-02 17:13:09
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-29 19:40:14
 * @Description: 
--> 
<template>
  <div class="bind">
    <p>{{message}}</p>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  async asyncData ({ route, app, $axios }) {
    const res = {
      message: "请先登录",
      status: false,
    };
    const { code, state } = route.query;
    const token = app.$cookies.get('Authorization');
    if (token) {
      try {
        // 发送ajax
        const resData = await $axios.get('/api/oauth/bind', {
          params: {
            code, state,
            redirect_uri: app.$constant.redirect_uris.bind
          }
        });
        console.log('resData', resData);
        res.message = "成功";
        res.status = true;
      } catch (error) {
        res.message = error.message || error.errMsg || error.toString();
        res.status = false;
      }
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
  font-size: 20px;
  padding: 24px;
}
</style>