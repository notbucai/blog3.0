<template>
  <v-dialog v-model="showPhoneBindDialog" persistent max-width="400px">
    <v-card class="bind-phton-card">
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
                  :loading="loadScriptIng || codeTmp.loading"
                  :disabled="codeTmp.isSend"
                  @click="handleGetCodeCheck"
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
</template>
<script>
export default {
  props: {
    visible: Boolean,
  },
  data () {
    return {
      // showPhoneBindDialog: false,
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
      loadScriptIng: false,
    };
  },
  computed: {
    showPhoneBindDialog: {
      get () {
        return this.visible;
      },
      set (v) {
        this.$emit('update:visible', v);
      }
    }
  },
  mounted () {
    this.loadScript();
  },
  methods: {
    async handleSubmit (formElName) {
      const isValidate = this.$refs[formElName].validate();
      if (!isValidate) return;
      try {
        this.submitIng = true;
        const form = this.formData;
        await this.$axios.post('/api/user/account/bind/phone', form);
        // 更新用户信息
        await this.$store.dispatch('updateUserInfo', {
          value: form.phone,
          key: 'phone'
        });
        this.$snackbar.success('成功');
        this.$emit('success', true);
        this.showPhoneBindDialog = false;
      } catch (error) {
        console.log('error', error);
      }
      this.submitIng = false;
    },
    // 加载Captcha
    loadScript() {
      if (this.loadScriptIng) return;
      this.loadScriptIng = true;
      const script = document.createElement('script');
      script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
      script.onload = () => {
        this.loadCaptcha();
        this.loadScriptIng = false;
      };
      script.onerror = () => {
        this.loadScriptIng = false;
        // message
        return this.$snackbar.error('验证码加载失败，请刷新重试');
      }
      document.body.appendChild(script);
    },
    loadCaptcha() {
      const smsBtn = document.createElement('button');
      smsBtn.id = `smsBtn_${Math.random().toString(36).substr(2)}`;
      smsBtn.hidden = true;
      document.body.appendChild(smsBtn);
      this.captchaButton = smsBtn;
      const v = initAliyunCaptcha({
        SceneId: 'mneshqxu', // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
        prefix: '14d1vp', // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
        mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
        element: '#captchaElement', //页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
        button: `#${smsBtn.id}`, // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
        captchaVerifyCallback: async (captchaVerifyParam) => {
          // console.log('captchaVerifyParam', captchaVerifyParam);
          // this.$axios.post('');
          await this.handleGetCode(captchaVerifyParam);
          return {
            captchaResult: true,
            bizResult: {},
          }
        }, // 业务请求(带验证码校验)回调函数，无需修改
        onBizResultCallback: (bizResult) => {
          console.log('bizResult', bizResult);
        }, // 业务请求结果回调函数，无需修改
        // getInstance: getInstance, // 绑定验证码实例函数，无需修改
        slideStyle: {
          width: 360,
          height: 40,
        }, // 滑块验证码样式，支持自定义宽度和高度，填入数字即可，单位为px
      });
    },
    verifyCaptcha() {
      if (this.loadScriptIng) return;
      console.log('this.captchaButton', this.captchaButton);
      this.captchaButton.click();
    },
    async handleGetCodeCheck() {
      const phone = this.formData.phone;
      const errlist = this.$constant.valid.PHONE.filter(item => {
        return !(typeof item(phone) == 'boolean');
      });
      if (errlist.length) {
        return this.$snackbar.error('手机号不能为空');
      }
      this.verifyCaptcha();
    },
    // 获取验证码
    async handleGetCode () {
      const phone = this.formData.phone;
      codeTmp.loading = true; // 开始发送

      try {
        // 发送ajax
        await this.$axios.post('api/common/sendPhoneCode', {
          phone,
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
  },
}
</script>
<style lang="scss">
.bind-phton-card.theme--dark {
  .card-box {
    .v-form {
      .form-field {
        label {
          color: #ccc;
        }
      }
    }
  }
}
</style>


<style lang="scss" scoped>
.bind-phton-card {
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
}
</style>
