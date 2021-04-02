<template>
  <div id="login">
    <canvas id="space" ref="space"></canvas>

    <div class="login-container">
      <!-- 插画 -->
      <div class="login-pic">
        <img
          :src="`https://image.notbucai.com/pixiv/${pixivIndex}.jpg` | imageMogr2(600)"
          alt="pic"
        />
      </div>
      <!-- 登录框 -->
      <div class="login-form">
        <div class="login-form--title">登录</div>
        <el-form :model="formData" :rules="rules" ref="login-form" class="login-form_form">
          <el-form-item prop="login">
            <el-input v-model="formData.login" placeholder="请输入手机/邮箱/用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input v-model="formData.pass" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-form_button"
              type="primary"
              round
              @click="handleSubmit('login-form')"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import canvasAn from './canvasAn';
import { mapState, mapActions } from 'vuex';
let stopCanAn = null;
let pixivIndex = (Math.random() * 10) | 0;
let loadingMark;
export default {
  data() {
    return {
      formData: {
        login: '',
        pass: ''
      },
      rules: {
        login: [{ required: true, message: '请输入登录名' }],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' }
        ]
      },
      pixivIndex,
      redirectPath: ''
    };
  },
  computed: {
    ...mapState(['token'])
  },
  created() {
    const redirect = this.$route.query.redirect;
    this.redirectPath = redirect;
    if (redirect) return;
    const token = localStorage.getItem('token');
    if (token) {
      this.$router.push('/home');
      return;
    }
  },
  mounted() {
    stopCanAn = canvasAn(this.$refs['space']);
  },
  beforeDestroy() {
    stopCanAn();
  },
  methods: {
    ...mapActions(['setToken', 'setUser']),
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          loadingMark = this.$loading({ lock: true });
          this.handleLogin();
        } else {
          return false;
        }
      });
    },
    async handleLogin() {
      const [err, data] = await this.$http.login(this.formData);
      if (err) {
        loadingMark && loadingMark.close();
        return;
      }
      this.setToken(data);
      this.handleGetUser();
    },
    async handleGetUser() {
      const [, data] = await this.$http.userInfo();

      loadingMark && loadingMark.close();
      if (data) {
        this.setUser(data);
        this.$message.success('登录成功');
        let path = this.redirectPath || '/home';
        // 跳转路由
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
}
#space {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.login {
  &-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 1140px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-pic {
    min-height: 200px;
    border-radius: 12px;
    flex: 1;
    box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    img {
      width: 100%;
      border-radius: 12px;
      display: block;
    }
  }
  &-form {
    width: 340px;
    min-height: 400px;
    margin-left: 36px;
    background-color: #fff;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.05);
    padding: 36px;
    box-sizing: border-box;
    &--title {
      font-size: 32px;
      text-align: center;
      margin-bottom: 36px;
      font-weight: bold;
    }
    &_form {
    }
    &_button {
      width: 100%;
    }
  }
}
</style>