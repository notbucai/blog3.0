<!--
 * @Author: bucai
 * @Date: 2020-05-02 21:01:07
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-08 22:14:51
 * @Description:
-->
<template>
  <Head>
    <Script src="//at.alicdn.com/t/font_2451840_fhijy36qb98.js" defer />
  </Head>
  <v-dialog :z-index="9999" height="" persistent v-model="loginOrRegisterDialog">
    <v-card>
      <div class="back_btn-box">
        <v-btn text flat @click="loginOrRegisterDialog = !loginOrRegisterDialog">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
      <div class="login-box">
        <header class="login_header-box">
          <h2>
            欢迎你，
            <v-btn text variant="text" flat color="pink-lighten-1" class="header_action-btn"
              @click="setType(data.type == 1 ? 2 : 1)">{{ reTypeToName(data.type) }}</v-btn>
          </h2>
          <h3>请填写以下信息进行{{ typeToName(data.type) }}</h3>
        </header>
        <!-- 登录 -->
        <v-form v-show="isType(1)" ref="loginFormRef" v-model="data.loginValid" lazy-validation>
          <div class="form-field required">
            <label>用户名/手机号/邮箱</label>
            <v-text-field v-model="data.loginForm.login" :rules="$constant.valid.REQUIRED" error-messages="123123"
              required></v-text-field>
          </div>
          <div class="form-field required">
            <label>密码</label>
            <v-text-field v-model="data.loginForm.pass" type="password" :rules="$constant.valid.REQUIRED"
              required></v-text-field>
          </div>
        </v-form>
        <!-- 注册 -->
        <v-form v-show="isType(2)" ref="registerFormRef" v-model="data.registerValid" lazy-validation>
          <div class="form-field required">
            <label>用户名</label>
            <v-text-field v-model="data.registerForm.username" :rules="$constant.valid.REQUIRED" required></v-text-field>
          </div>
          <div class="form-field required">
            <label>手机号</label>
            <v-text-field v-model="data.registerForm.phone" :rules="$constant.valid.PHONE" required></v-text-field>
          </div>
          <div class="form-field required">
            <label>验证码</label>
            <v-text-field v-model="data.registerForm.code" :rules="$constant.valid.REQUIRED" required>
              <template #append>
                <div class="sms_box">
                  <v-btn text flat :loading="data.loadScriptIng || data.codeTmp.loading" :disabled="data.codeTmp.isSend"
                    @click="handleShowVCodeForGetCode">
                    <v-icon v-if="!data.codeTmp.isSend">mdi-message-processing</v-icon>
                    <span v-else>{{ data.codeTmp.num }}</span>
                  </v-btn>
                </div>
              </template>
            </v-text-field>
          </div>
          <div class="form-field required">
            <label>密码</label>
            <v-text-field v-model="data.registerForm.pass" type="password" :rules="$constant.valid.REQUIRED"
              required></v-text-field>
          </div>
        </v-form>

        <div class="form-field center mt-4">
          <v-btn size="large" flat color="grey-lighten-4" class="continue-btn" @click="handleSubmit"
            :loading="data.submitIng">
            继续
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <div class="form-field center mt-4">
          <v-btn :elevation="0" icon flat @click="handleAuthLogin('github')">
            <!-- <i class="symbol-icon" >&#xea0a;</i> -->
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconGitHub"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon flat x-large @click="handleAuthLogin('qq')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconQQ1"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon flat x-large @click="handleAuthLogin('baidu')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconbaidu"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon flat x-large @click="handleAuthLogin('weibo')">
            <svg class="symbol-icon" aria-hidden="true">
              <use xlink:href="#iconweibo"></use>
            </svg>
          </v-btn>

          <v-btn :elevation="0" icon flat x-large @click="handleAuthLogin('gitee')">
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

<script lang="ts" setup>
import * as $constant from '../constant'

let scriptError = false, scriptSuccesful = false, captcha = null;
const loginFormRef = useState('ref-loginFormRef', () => null)
const registerFormRef = useState('ref-registerFormRef', () => null)
const user = useUser()
const token = useToken()
const data = useState('local-data', () => {
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
  }
})

const loginOrRegisterDialog = useLoginOrRegisterDialog()

const $axios: any = {};


function typeToName(type) {
  return type == 1 ? '登录' : '注册';
}
function reTypeToName(type) {
  return type == 1 ? '注册' : '登录';
}

function isType(type) {
  return data.value.type === type;
}
function setType(type) {
  data.value.type = type;
  // 注册
  handleLoadVImageCode();
}
function handleLoadVImageCode() {
  if (!isType(2)) return;
  if (data.value.loadScriptIng) return;
  if (scriptSuccesful) return;
  if (scriptError) return;
  data.value.loadScriptIng = true;

  const scriptEl = document.createElement('script');
  scriptEl.src = "https://ssl.captcha.qq.com/TCaptcha.js";
  scriptEl.onload = () => {
    data.value.loadScriptIng = false;
    scriptSuccesful = true;
    // 执行逻辑
    captcha = new (window as any).TencentCaptcha("2035186935", (res) => {
      if (res.ret === 0) {
        captchaSuccesful(res);
      } else {
        console.log(res);
        // $snackbar.error('');
      }
    }, {});
  }
  scriptEl.onerror = () => {
    data.value.loadScriptIng = false;
    scriptError = true;
    // 错误提示
    // todo
    // $snackbar.error('加载资源失败，请刷新页面重试。');
  }
  document.querySelector('body').appendChild(scriptEl);
} function captchaSuccesful(data) {
  console.log('data', data);
  // 调用接口验证数据
  // 调用发送验证码
  handleGetCode(data);
} function handleAuthLogin(type) {
  console.log('type', type);
  const url = $constant.STATE_LIST['login_' + type];
  console.log('url', url);

  const sonWin = window.open(url, '绑定');
  const loop = setInterval(function () {
    if (sonWin.closed) {
      clearInterval(loop);
      location.reload();
    }
  }, 100);
} function handleShowVCodeForGetCode() {

  if (data.value.loadScriptIng) return;
  if (scriptError) {
    // todo
    return // $snackbar.error('加载资源失败，请刷新页面重试。');
  }
  if (!captcha) {
    // todo
    return // $snackbar.error('无验证码实例！！！');
  }
  const phone = data.value.registerForm.phone;
  const errlist = $constant.valid.PHONE.filter(item => {
    return !(typeof item(phone) == 'boolean');
  });
  if (errlist.length) {
    // todo
    return // $snackbar.error('手机号不能为空');
  }

  captcha.show();
}
async function handleGetCode(captcha) {
  const phone = data.value.registerForm.phone;
  const errlist = $constant.valid.PHONE.filter(item => {
    return !(typeof item(phone) == 'boolean');
  });
  if (errlist.length) {
    // todo
    return // $snackbar.error('手机号不能为空');
  }

  const codeTmp = data.value.codeTmp;
  codeTmp.loading = true; // 开始发送

  try {
    // 发送ajax
    // todo $axios
    const reData = await $axios.post('api/common/sendPhoneCode', {
      phone,
      captcha
    });
    codeTmp.loading = false; // 发送完毕
    if (!reData.status) {
      return false;
    }
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
    return true;
  } catch (error) {
    codeTmp.loading = false;
  }
  return false;
}
async function handleSubmit(event) {
  const formElRef = data.value.type == 1 ? loginFormRef.value : registerFormRef.value;
  const formName = data.value.type == 1 ? 'loginForm' : 'registerForm'
  console.log('formElRef', formElRef);

  console.log('formElRef.items.filter(input => !input.validate(true))', formElRef.items, await Promise.all(formElRef.items.map(input => input.validate(true))));
  console.log('formElRef.items[0]', formElRef.items[0]);

  console.log('formElRef.items', formElRef.items[0].foucs, formElRef.items[0].hasMessages, formElRef.items[0].showMessages);

  // 验证
  const isValidate = formElRef.validate();
  if (!isValidate) return;
  const form = this[formName];
  const apiAddr = data.value.type == 1 ? 'api/users/signin' : 'api/users/signup';
  try {
    data.value.submitIng = true;
    const resData = await $axios.post(apiAddr, form);
    console.log('resData', resData);
    // todo cookies
    // $cookies.set('Authorization', resData, {
    //   path: '/',
    //   maxAge: 5 * 24 * 60 * 60
    // });
    token.value = resData;
    // $store.commit('SET_TOKEN', resData);
    // $store.commit('SET_LOGIN_OR_REGISTER_DIALOG');
    loginOrRegisterDialog.value = !loginOrRegisterDialog.value

    const userinfo = await $axios.get('api/users/info');
    console.log('userinfo', userinfo);
    // $store.commit('SET_USER', userinfo);
    user.value = userinfo

  } catch (error) {
    console.log(error);
  }
  data.value.submitIng = false;
}

</script>

<style lang="scss">
.v-dialog {
  .v-overlay__content {
    max-height: 100%;
    max-width: 100%;
  }
}

.v-theme--dark {
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
  width: 440px;
  max-width: 100%;
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
        /* color: rgb(236, 88, 141);
        caret-color: rgb(236, 88, 141); */
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
      margin: 0 0 6px;
      color: #0d0c22;
    }

    .continue-btn {
      width: 240px;
    }

    .v-text-field {
      padding: 0;
      margin: 0;
    }

    .v-field__overlay {
      display: none;
    }

    .v-field__field {
      .v-field-label {
        display: none;
      }
    }

    .v-input__details {
      margin-bottom: 0;
      padding: 0;
      min-height: 0;
    }

    .v-field__outline {
      display: none;
    }

    .v-field__input {
      opacity: 1 !important;
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