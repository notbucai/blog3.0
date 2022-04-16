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
                  :loading="codeTmp.loading"
                  :disabled="codeTmp.isSend"
                  @click="handleGetCode"
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
  created () {
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
    // 获取验证码
    async handleGetCode () {
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
