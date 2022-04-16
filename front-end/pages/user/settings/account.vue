<!--
 * @Author: bucai
 * @Date: 2020-06-02 16:29:03
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-04-16 16:33:25
 * @Description: 
--> 
<template>
  <div class="mt-4">
    <v-card class="pl-10 pr-10">
      <v-card-title>账号关联</v-card-title>
      <div class="content body-2">
        <v-divider></v-divider>
        <template v-for="(item, index) in formShowJson">
          <v-divider :key="index"></v-divider>
          <v-row align="center" class="pa-4" :key="item.key">
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
              <div class="text-right">
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
              </div>
            </v-col>
          </v-row>
        </template>
      </div>
    </v-card>
    <client-only>
      <BindPhone
        :visible.sync="showPhoneBindDialog"
        @success="handleBindPhoneSuccess"
      />
    </client-only>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  middleware: 'auth',
  computed: {
    ...mapState(['user'])
  },
  components: {
    BindPhone: () => import('@/components/user/BindPhone.vue')
  },
  data () {
    return {
      submitIng: false,

      showPhoneBindDialog: false,

      selectObj: {},
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
        this.showBindPhoneDialog();
      }
    },

    async handleUnbind (type, state) {
      if (type == 'oauth2') {
        this.handleOauthUnBind(state);
      } else if (type == 'phone') {
        this.unbindPhone(state);
      }
    },

    async handleBindPhoneSuccess () {
      location.reload();
    }
  },
}
</script>
