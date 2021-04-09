<!--
 * @Author: bucai
 * @Date: 2020-05-02 21:01:07
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-01 22:26:36
 * @Description:
-->
<template>
  <v-dialog
    :z-index="9999"
    persistent
    v-model="LoginOrRegisterDialog"
    width="440"
  >
    <v-card>
      <div class="back_btn-box">
        <v-btn elevation="0" text @click="SET_LOGIN_OR_REGISTER_DIALOG">
          <v-icon>{{ $icons['mdi-arrow-left'] }}</v-icon>
        </v-btn>
      </div>
      <div class="login-box">
        <header class="login_header-box">
          <h2>
            欢迎你，
            <v-btn
              text
              class="header_action-btn"
              @click="setType(type == 1 ? 2 : 1)"
              >{{ type | reTypeToName }}</v-btn
            >
          </h2>
          <h3>请填写以下信息进行{{ type | typeToName }}</h3>
        </header>
        <!-- 登录 -->
        <v-form
          v-show="isLogin"
          ref="loginForm"
          v-model="loginValid"
          lazy-validation
        >
          <div class="form-field required">
            <label>用户名/手机号/邮箱</label>
            <v-text-field
              v-model="loginForm.login"
              :rules="$constant.valid.REQUIRED"
              required
            ></v-text-field>
          </div>
          <div class="form-field required">
            <label>密码</label>
            <v-text-field
              v-model="loginForm.pass"
              type="password"
              :rules="$constant.valid.REQUIRED"
              required
            ></v-text-field>
          </div>
        </v-form>
        <!-- 注册 -->
        <v-form
          v-show="isRegister"
          ref="registerForm"
          v-model="registerValid"
          lazy-validation
        >
          <div class="form-field required">
            <label>用户名</label>
            <v-text-field
              v-model="registerForm.username"
              :rules="$constant.valid.REQUIRED"
              required
            ></v-text-field>
          </div>
          <div class="form-field required">
            <label>手机号</label>
            <v-text-field
              v-model="registerForm.phone"
              :rules="$constant.valid.PHONE"
              required
            ></v-text-field>
          </div>
          <div class="form-field required">
            <label>验证码</label>
            <v-text-field
              v-model="registerForm.code"
              :rules="$constant.valid.REQUIRED"
              required
            >
              <div class="sms_box" slot="append">
                <v-btn
                  text
                  :loading="loadScriptIng || codeTmp.loading"
                  :disabled="codeTmp.isSend"
                  @click="handleShowVCodeForGetCode"
                >
                  <v-icon v-if="!codeTmp.isSend">{{
                    $icons['mdi-message-processing']
                  }}</v-icon>
                  <span v-else>{{ codeTmp.num }}</span>
                </v-btn>
              </div>
            </v-text-field>
          </div>
          <div class="form-field required">
            <label>密码</label>
            <v-text-field
              v-model="registerForm.pass"
              type="password"
              :rules="$constant.valid.REQUIRED"
              required
            ></v-text-field>
          </div>
        </v-form>

        <div class="form-field center mt-4">
          <v-btn
            large
            elevation="0"
            class="continue-btn"
            @click="handleSubmit"
            :loading="submitIng"
          >
            继续
            <v-icon>{{ $icons['mdi-arrow-right'] }}</v-icon>
          </v-btn>
        </div>

        <div class="form-field center mt-4">
          <v-btn :elevation="0" icon x-large @click="handleAuthLogin('github')">
            <!-- <i class="symbol-icon" >&#xea0a;</i> -->
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconGitHub"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon x-large @click="handleAuthLogin('qq')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconQQ1"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon x-large @click="handleAuthLogin('baidu')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconbaidu"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon x-large @click="handleAuthLogin('weibo')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconweibo"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon x-large @click="handleAuthLogin('gitee')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#icongitee"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon x-large @click="handleAuthLogin('notbucai')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconxiaochengxu"></use>
            </svg>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
let scriptError = false, scriptSuccesful = false;
export default {
  data () {
    return {
      type: 1,
      submitIng: false,
      loginValid: true,
      loginForm: {
        login: '',
        pass: ''
      },
      registerValid: false,
      registerForm: {
        phone: '',
        username: '',
        pass: '',
        code: ''
      },
      codeTmp: {
        // 验证码相关
        loading: false, // 是否在获取中
        isSend: false,
        num: -1 // 进度
      },
      // 验证码
      loadScriptIng: false,
      // scriptSuccesful: false,
    };
  },
  mounted () { },
  computed: {
    ...mapState(['LoginOrRegisterDialog']),
    // 是否是登录
    isLogin () {
      return this.isType(1);
    },
    // 是否是注册
    isRegister () {
      return this.isType(2);
    }
  },
  filters: {
    typeToName (type) {
      return type == 1 ? '登录' : '注册';
    },
    reTypeToName (type) {
      return type == 1 ? '注册' : '登录';
    }
  },
  methods: {
    ...mapMutations(['SET_LOGIN_OR_REGISTER_DIALOG']),
    // 验证类型
    isType (type) {
      return this.type === type;
    },
    setType (type) {
      this.type = type;
      // 注册
      this.handleLoadVImageCode();
    },
    handleLoadVImageCode () {
      if (!this.isType(2)) return;
      if (this.loadScriptIng) return;
      if (scriptSuccesful) return;
      if (scriptError) return;
      this.loadScriptIng = true;

      const scriptEl = document.createElement('script');
      scriptEl.src = "https://ssl.captcha.qq.com/TCaptcha.js";
      scriptEl.onload = () => {
        this.loadScriptIng = false;
        scriptSuccesful = true;
        // 执行逻辑
        this.captcha = new window.TencentCaptcha("2035186935", (res) => {
          if (res.ret === 0) {
            this.captchaSuccesful(res);
          } else {
            console.log(res);
            // this.$snackbar.error('');
          }
        }, {});
      }
      scriptEl.onerror = () => {
        this.loadScriptIng = false;
        scriptError = true;
        // 错误提示
        this.$snackbar.error('加载资源失败，请刷新页面重试。');
      }
      document.querySelector('body').appendChild(scriptEl);
    },
    captchaSuccesful (data) {
      console.log('data', data);
      // 调用接口验证数据
      // 调用发送验证码
      this.handleGetCode(data);
    },
    handleAuthLogin (type) {
      console.log('type', type);
      const url = this.$constant.STATE_LIST['login_' + type];
      console.log('url', url);

      const sonWin = window.open(url, '绑定');
      const loop = setInterval(function () {
        if (sonWin.closed) {
          clearInterval(loop);
          location.reload();
        }
      }, 100);
    },
    handleShowVCodeForGetCode () {
      
      if (this.loadScriptIng) return;
      if (scriptError) {
        return this.$snackbar.error('加载资源失败，请刷新页面重试。');
      }
      if (!this.captcha) {
        return this.$snackbar.error('无验证码实例！！！');
      }
      const phone = this.registerForm.phone;
      const errlist = this.$constant.valid.PHONE.filter(item => {
        return !(typeof item(phone) == 'boolean');
      });
      if (errlist.length) {
        return this.$snackbar.error('手机号不能为空');
      }
      
      this.captcha.show();
    },
    async handleGetCode (captcha) {
      const phone = this.registerForm.phone;
      const errlist = this.$constant.valid.PHONE.filter(item => {
        return !(typeof item(phone) == 'boolean');
      });
      if (errlist.length) {
        return this.$snackbar.error('手机号不能为空');
      }

      const codeTmp = this.codeTmp;
      codeTmp.loading = true; // 开始发送

      try {
        // 发送ajax
        await this.$axios.post('api/common/sendPhoneCode', {
          phone,
          captcha
        });
        codeTmp.loading = false; // 发送完毕
        // 开始倒计时
        codeTmp.isSend = true;
        codeTmp.num = 60;
        let timer = setInterval(() => {
          codeTmp.num--;
          if (codeTmp.num == 0) {
            codeTmp.isSend = false;
            clearInterval(timer);
          }
        }, 1000);
      } catch (error) {
        codeTmp.loading = false;
      }
    },
    async handleSubmit () {
      const formElName = this.type == 1 ? 'loginForm' : 'registerForm';
      // 验证
      const isValidate = this.$refs[formElName].validate();
      if (!isValidate) return;
      const form = this[formElName];
      const apiAddr = this.type == 1 ? 'api/users/signin' : 'api/users/signup';
      try {
        this.submitIng = true;
        const resData = await this.$axios.post(apiAddr, form);
        console.log('resData', resData);
        this.$cookies.set('Authorization', resData, {
          path: '/',
          maxAge: 5 * 24 * 60 * 60
        });

        this.$store.commit('SET_TOKEN', resData);
        this.$store.commit('SET_LOGIN_OR_REGISTER_DIALOG');

        const userinfo = await this.$axios.get('api/users/info');
        console.log('userinfo', userinfo);
        this.$store.commit('SET_USER', userinfo);
      } catch (error) {
        console.log(error);
      }
      this.submitIng = false;
    }
  }
};
</script>

<style lang="scss">
.theme--dark {
  .login-box {
    .form-field {
      label {
        color: #9e9e9e !important;
      }
      .v-input__slot {
        input {
          color: #333;
        }
      }
    }
  }
}
.back_btn-box {
  padding: 8px 6px 0;
}
.login-box {
  padding: 12px 28px 34px;
  .symbol-icon {
    font-size: 2em;
    opacity: 0.8;
  }
  .login_header-box {
    overflow: hidden;
    h2 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      .header_action-btn {
        font-size: 16px;
        color: rgb(236, 88, 141);
        caret-color: rgb(236, 88, 141);
      }
    }
    h3 {
      color: #999;
      margin-bottom: 12px;
    }
  }
  .form-field {
    &.center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.required {
      label {
        &::after {
          content: '*';
          color: #f00;
          font-size: 14px;
          margin-left: 4px;
        }
      }
    }
    label {
      padding-left: 8px;
      display: block;
      /* font: 700 15px/24px; */
      font-weight: 700;
      font-size: 15px;
      margin: 14px 0 6px;
      color: #0d0c22;
    }
    .continue-btn {
      width: 240px;
    }
    .v-text-field {
      padding: 0;
      margin: 0;
    }
    .v-input__slot {
      .sms_box {
        align-self: center;
        /* cursor: pointer; */
        /* padding-left: 12px; */
        &:hover {
          .v-icon {
            color: #333;
          }
        }
      }
      &::before,
      &::after {
        content: none;
      }
    }
    input {
      border-radius: 4px;
      border: 1px solid transparent;
      background-color: #f4f4f4;
      box-sizing: border-box;
      height: 40px;
      padding: 10px 16px;
      max-height: none;
      transition: all 0.3s;
      caret-color: #f00;
      font-size: 14px;
      &:hover,
      &:focus {
        background-color: #fff;
        border-color: rgba(4, 120, 190, 0.4);
        box-shadow: 0 0 0 4px rgba(4, 120, 190, 0.1);
      }
    }
  }
}
</style>