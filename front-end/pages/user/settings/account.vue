<!--
 * @Author: bucai
 * @Date: 2020-06-02 16:29:03
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-09 20:32:00
 * @Description: 
--> 
<template>
  <div>
    <v-card class="pl-10 pr-10">
      <v-card-title>账号关联</v-card-title>
      <div class="content body-2">
        <v-divider></v-divider>
        <template v-for="(item, index) in formShowJson">
          <v-divider :key="index"></v-divider>
          <v-row align="center" class="pa-2" :key="item.key">
            <v-col :cols="2">{{ item.label }}</v-col>
            <v-col>
              <input
                style="width: 100%"
                type="text"
                :value="user[item.key]"
                disabled
              />
            </v-col>
            <v-col :cols="2">
              <v-btn
                v-if="!user[item.key]"
                color="primary"
                x-small
                text
                @click="handleBind(item.type, item.state)"
                >绑定</v-btn
              >
              <v-btn
                v-else
                color="primary"
                x-small
                text
                @click="handleUnbind(item.type, item.state)"
                >解除绑定</v-btn
              >
            </v-col>
          </v-row>
        </template>
      </div>
    </v-card>
    <v-dialog v-model="showPhoneBindDialog" persistent max-width="400px">
      <v-card>
        <div class="back_btn-box">
          <v-btn elevation="0" text @click="showPhoneBindDialog = false">
            <v-icon>{{ $icons['mdi-arrow-left'] }}</v-icon>
          </v-btn>
        </div>
        <div class="card-box">
          <header class="login_header-box">
            <h3>请填写以下信息进行绑定</h3>
          </header>
          <v-form ref="phoneForm" lazy-validation>
            <div class="form-field required">
              <label>手机号</label>
              <v-text-field
                v-model="formData.phone"
                :rules="$constant.valid.PHONE"
                required
              ></v-text-field>
            </div>
            <div class="form-field required">
              <label>验证码</label>
              <v-text-field
                v-model="formData.code"
                :rules="$constant.valid.REQUIRED"
                required
              >
                <div class="sms_box" slot="append">
                  <v-btn
                    text
                    :loading="codeTmp.loading"
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
          </v-form>

          <div class="form-field center mt-4">
            <v-btn
              large
              elevation="0"
              class="continue-btn"
              @click="handleSubmit('phoneForm')"
              :loading="submitIng"
            >
              继续
              <v-icon>{{ $icons['mdi-arrow-right'] }}</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
let scriptError = false, scriptSuccesful = false;

export default {
  middleware: 'auth',
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      showPhoneBindDialog: false,
      submitIng: false,

      selectObj: {},
      formData: {
        phone: '',
        code: ''
      },
      codeTmp: {
        // 验证码相关
        loading: false, // 是否在获取中
        isSend: false,
        num: -1 // 进度
      },
      formShowJson: [
        {
          label: "手机",
          key: "phone",
          state: "phone",
          type: "phone"
        },
        {
          label: "GitHub",
          key: "githubLogin",
          state: "github",
          type: "oauth2"
        },
        {
          label: "百度",
          key: "baiduName",
          state: "baidu",
          type: "oauth2"
        },
        {
          label: "微博",
          key: "weiboScreenName",
          state: "weibo",
          type: "oauth2"
        },
        {
          label: "QQ",
          key: "qqName",
          state: "qq",
          type: "oauth2"
        },
        {
          label: "GITEE",
          key: "giteeLogin",
          state: "gitee",
          type: "oauth2"
        },
        {
          label: "小程序绑定",
          key: "notbucaiNickname",
          state: "notbucai",
          type: "oauth2"
        },
      ],
      // 验证码
      loadScriptIng: false,
    }
  },
  methods: {
    handleLoadVImageCode () {
      if (!this.showPhoneBindDialog) return;
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
    handleShowVCodeForGetCode () {
      if (this.loadScriptIng) return;
      if (this.scriptError) {
        return this.$snackbar.error('加载资源失败，请刷新页面重试。');
      }
      if (!this.captcha) {
        return this.$snackbar.error('无验证码实例！！！');
      }
      const phone = this.formData.phone;
      const errlist = this.$constant.valid.PHONE.filter(item => {
        return !(typeof item(phone) == 'boolean');
      });
      if (errlist.length) {
        return this.$snackbar.error('手机号不能为空');
      }
      this.captcha.show();
    },
    // 获取验证码
    async handleGetCode (captcha) {
      const phone = this.formData.phone;
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

    async handleSubmit (formElName) {
      const isValidate = this.$refs[formElName].validate();
      if (!isValidate) return;
      try {
        this.submitIng = true;
        const form = this.formData;
        await this.$axios.post('/api/user/account/bind/phone', form);
        this.$snackbar.success('成功');
        this.showPhoneBindDialog = false;
        location.reload();
      } catch (error) {
        console.log('error', error);
      }
      this.submitIng = false;
    },

    async handleOauthBind (state) {
      console.log(state);
      const url = this.$constant.STATE_LIST['bind_' + state];
      const sonWin = window.open(url, '绑定');
      const loop = setInterval(function () {
        if (sonWin.closed) {
          clearInterval(loop);
          location.reload();
        }
      }, 100);
    },
    async handleOauthUnBind (state) {
      const isUnBind = confirm("是否解绑?");
      if (!isUnBind) return;
      await this.$axios.get('/api/oauth/unbind', {
        params: {
          state
        }
      });
      this.$snackbar.success('成功');
      location.reload();
    },

    showBindPhoneDialog () {
      this.showPhoneBindDialog = true;
      this.handleLoadVImageCode();
    },
    async unbindPhone () {
      const isUnBind = confirm("是否解绑?");
      if (!isUnBind) return;
      await this.$axios.post('/api/user/account/unbind/phone');
      this.$snackbar.success('成功');
      location.reload();
    },

    handleBind (type, state) {
      if (type == 'oauth2') {
        this.handleOauthBind(state);
      } else if (type == 'phone') {
        this.showBindPhoneDialog(state);
      }
    },

    async handleUnbind (type, state) {
      if (type == 'oauth2') {
        this.handleOauthUnBind(state);
      } else if (type == 'phone') {
        this.unbindPhone(state);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.card-box {
  padding: 12px 28px 34px;
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